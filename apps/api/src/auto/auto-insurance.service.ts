import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { type Db } from "@crm/db";
import { InjectDatabase } from "../database/database.constants";
import {
	type CreateVehicleInput,
	type CreateDriverProfileInput,
	type CreateInsuranceDossierInput,
	type UpdateDossierStatusInput,
	type ImportCommissionStatementInput,
	type DossierStatus,
} from "@crm/validation";
import { SivService } from "./siv.service";

@Injectable()
export class AutoInsuranceService {
	constructor(
		@InjectDatabase() private readonly db: Db,
		@Inject(SivService) private readonly sivService: SivService,
	) {}

	// ==========================================
	// VÉHICULES & SIV
	// ==========================================

	async lookupSiv(licensePlate: string) {
		return this.sivService.lookupLicensePlate(licensePlate);
	}

	async createVehicle(input: CreateVehicleInput) {
		return this.db.vehicle.create({
			data: {
				contactId: input.contactId,
				licensePlate: input.licensePlate.toUpperCase().trim(),
				vin: input.vin,
				brand: input.brand,
				model: input.model,
				version: input.version,
				firstRegistrationDate: input.firstRegistrationDate,
				fiscalPower: input.fiscalPower,
				fuelType: input.fuelType,
				usage: input.usage,
				parking: input.parking,
				annualMileage: input.annualMileage,
				purchaseDate: input.purchaseDate,
				sivRawData: input.sivRawData as any,
			},
		});
	}

	async listVehiclesByContact(contactId: string) {
		return this.db.vehicle.findMany({
			where: { contactId },
			orderBy: { createdAt: "desc" },
		});
	}

	// ==========================================
	// CONDUCTEURS
	// ==========================================

	async createDriverProfile(input: CreateDriverProfileInput) {
		return this.db.driverProfile.create({
			data: {
				contactId: input.contactId,
				licenseNumber: input.licenseNumber,
				licenseDate: input.licenseDate,
				licenseType: input.licenseType,
				crmCoefficient: input.crmCoefficient,
				claimsCount36Months: input.claimsCount36Months,
				atFaultClaims: input.atFaultClaims,
				glassBreakageClaims: input.glassBreakageClaims,
				parkingTheftClaims: input.parkingTheftClaims,
				insuranceHistoryMonths: input.insuranceHistoryMonths,
				cancellationHistory: input.cancellationHistory,
				suspensionHistory: input.suspensionHistory,
			},
		});
	}

	async getDriverProfileByContact(contactId: string) {
		return this.db.driverProfile.findFirst({
			where: { contactId },
			orderBy: { createdAt: "desc" },
		});
	}

	// ==========================================
	// DOSSIERS D'ASSURANCE
	// ==========================================

	async createDossier(input: CreateInsuranceDossierInput) {
		// Génération d'une référence unique DOS-YYYY-XXXXX
		const count = await this.db.insuranceDossier.count();
		const year = new Date().getFullYear();
		const reference = `DOS-${year}-${String(count + 1).padStart(5, "0")}`;

		// Date anniversaire par défaut à J+365 pour la loi Hamon
		const anniversaryDate = input.anniversaryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

		const dossier = await this.db.insuranceDossier.create({
			data: {
				reference,
				contactId: input.contactId,
				vehicleId: input.vehicleId,
				driverProfileId: input.driverProfileId,
				brokerPartnerId: input.brokerPartnerId,
				formula: input.formula,
				options: input.options as any,
				annualPremiumTTC: input.annualPremiumTTC,
				annualPremiumHT: input.annualPremiumHT,
				monthlyPayment: input.monthlyPayment,
				effectiveDate: input.effectiveDate || new Date(),
				anniversaryDate,
			},
			include: {
				vehicle: true,
				driverProfile: true,
				brokerPartner: true,
				contact: true,
			},
		});

		// Si un partenaire est sélectionné et qu'il a un barème de commission par défaut, pré-créer la ligne attendue
		if (input.brokerPartnerId) {
			const partner = await this.db.brokerPartner.findUnique({
				where: { id: input.brokerPartnerId },
			});
			if (partner?.defaultAcquisitionCommission) {
				await this.db.commissionRecord.create({
					data: {
						dossierId: dossier.id,
						type: "ACQUISITION_ONE_SHOT",
						status: "EN_ATTENTE",
						expectedAmount: partner.defaultAcquisitionCommission,
					},
				});
			}
		}

		return dossier;
	}

	async listDossiers(filters?: { status?: DossierStatus; contactId?: string }) {
		return this.db.insuranceDossier.findMany({
			where: {
				...(filters?.status && { status: filters.status }),
				...(filters?.contactId && { contactId: filters.contactId }),
			},
			include: {
				vehicle: true,
				driverProfile: true,
				brokerPartner: true,
				contact: {
					select: { id: true, firstName: true, lastName: true, phone: true, email: true },
				},
				documents: true,
				commissions: true,
			},
			orderBy: { createdAt: "desc" },
		});
	}

	async updateDossierStatus(input: UpdateDossierStatusInput) {
		const dossier = await this.db.insuranceDossier.findUnique({
			where: { id: input.dossierId },
		});

		if (!dossier) {
			throw new NotFoundException(`Dossier introuvable : ${input.dossierId}`);
		}

		return this.db.insuranceDossier.update({
			where: { id: input.dossierId },
			data: {
				status: input.status,
				...(input.policeNumber && { policeNumber: input.policeNumber }),
			},
			include: {
				vehicle: true,
				brokerPartner: true,
			},
		});
	}

	// ==========================================
	// BORDEREAUX & RAPPROCHEMENT DE COMMISSIONS
	// ==========================================

	async listBrokerPartners() {
		return this.db.brokerPartner.findMany({
			orderBy: { name: "asc" },
		});
	}

	async createBrokerPartner(data: {
		name: string;
		contactName?: string;
		email?: string;
		phone?: string;
		portalUrl?: string;
		defaultAcquisitionCommission?: number;
		defaultRenewCommissionRate?: number;
	}) {
		return this.db.brokerPartner.create({ data });
	}

	/**
	 * Moteur de réconciliation automatique :
	 * Importe un bordereau mensuel et rapproche les lignes de commissions avec les dossiers souscrits
	 */
	async importAndReconcileStatement(input: ImportCommissionStatementInput) {
		let totalAmount = 0;
		let reconciledCount = 0;
		let discrepancyCount = 0;

		const statement = await this.db.commissionStatement.create({
			data: {
				brokerPartnerId: input.brokerPartnerId,
				statementPeriod: input.statementPeriod,
				originalFilename: input.originalFilename,
				fileUrl: input.fileUrl,
				recordsCount: input.lines.length,
			},
		});

		for (const line of input.lines) {
			totalAmount += line.actualAmount;

			// Recherche d'un dossier correspondant (par référence contrat, plaque, ou référence dossier)
			let matchedDossier = null;
			if (line.partnerContractRef) {
				matchedDossier = await this.db.insuranceDossier.findFirst({
					where: { policeNumber: line.partnerContractRef },
				});
			}

			if (!matchedDossier && line.licensePlate) {
				const cleanPlate = line.licensePlate.toUpperCase().replace(/[\s-]/g, "");
				matchedDossier = await this.db.insuranceDossier.findFirst({
					where: {
						vehicle: { licensePlate: cleanPlate },
					},
				});
			}

			if (!matchedDossier && line.dossierReference) {
				matchedDossier = await this.db.insuranceDossier.findUnique({
					where: { reference: line.dossierReference },
				});
			}

			// Recherche d'un commissionRecord pré-existant ou calcul du montant attendu
			let expectedAmount = 80; // Valeur par défaut
			if (matchedDossier?.annualPremiumHT) {
				expectedAmount = matchedDossier.annualPremiumHT * 0.1; // 10% estimation
			}

			const isMatched = !!matchedDossier;
			const hasDiscrepancy = isMatched && Math.abs(expectedAmount - line.actualAmount) > 0.5;

			const status = isMatched
				? hasDiscrepancy
					? "ANOMALIE_ECART"
					: "RAPPROCHE_VALIDE"
				: "EN_ATTENTE";

			if (isMatched && !hasDiscrepancy) {
				reconciledCount++;
			} else if (hasDiscrepancy) {
				discrepancyCount++;
			}

			await this.db.commissionRecord.create({
				data: {
					statementId: statement.id,
					dossierId: matchedDossier ? matchedDossier.id : null,
					type: line.commissionType,
					status,
					partnerContractRef: line.partnerContractRef,
					actualAmount: line.actualAmount,
					expectedAmount,
					discrepancyAmount: line.actualAmount - expectedAmount,
					reconciledAt: isMatched ? new Date() : null,
					notes: matchedDossier
						? `Rapproché avec le dossier ${matchedDossier.reference}`
						: "Aucun contrat identifié sur ce bordereau",
				},
			});
		}

		return this.db.commissionStatement.update({
			where: { id: statement.id },
			data: {
				totalAmount,
				reconciledCount,
				discrepancyCount,
			},
			include: {
				records: true,
			},
		});
	}

	async listCommissionStatements() {
		return this.db.commissionStatement.findMany({
			include: {
				brokerPartner: true,
				records: true,
			},
			orderBy: { createdAt: "desc" },
		});
	}
}
