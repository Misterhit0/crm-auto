import { describe, expect, it } from "bun:test";
import {
	CommissionStatusSchema,
	CommissionTypeSchema,
	CreateDriverProfileInputSchema,
	CreateInsuranceDossierInputSchema,
	CreateVehicleInputSchema,
	DocumentTypeSchema,
	DossierStatusSchema,
	FormulaTypeSchema,
	FuelTypeSchema,
	ImportCommissionStatementInputSchema,
	ParkingTypeSchema,
	SivLookupInputSchema,
	SivLookupOutputSchema,
	UpdateDossierStatusInputSchema,
	VehicleUsageSchema,
} from "./auto-insurance";

describe("QA Test Suite: Immatriculation SIV & Nettoyage des Plaques", () => {
	it("nettoie et normalise les plaques françaises SIV", () => {
		const parsed1 = SivLookupInputSchema.parse({ licensePlate: "ab-123-cd" });
		expect(parsed1.licensePlate).toBe("AB123CD");

		const parsed2 = SivLookupInputSchema.parse({ licensePlate: " EF 456 GH " });
		expect(parsed2.licensePlate).toBe("EF456GH");
	});

	it("rejette les formats de plaques manifestement invalides", () => {
		expect(() => SivLookupInputSchema.parse({ licensePlate: "A" })).toThrow();
		expect(() =>
			SivLookupInputSchema.parse({
				licensePlate: "CETTEPLAQUEESTBEAUCOUPTROPLONGUE12345",
			}),
		).toThrow();
	});

	it("valide la sortie d'un lookup SIV complet avec marque, modèle et VIN", () => {
		const sivData = {
			licensePlate: "AB-123-CD",
			vin: "VF3UPHNKMPW123456",
			brand: "PEUGEOT",
			model: "208",
			version: "1.2 PureTech 100ch Allure",
			firstRegistrationDate: "2022-06-15",
			fiscalPower: 5,
			fuelType: "ESSENCE" as const,
		};
		const parsed = SivLookupOutputSchema.parse(sivData);
		expect(parsed.brand).toBe("PEUGEOT");
		expect(parsed.fuelType).toBe("ESSENCE");
		expect(parsed.fiscalPower).toBe(5);
	});
});

describe("QA Test Suite: CRM Conducteur & Bonus-Malus", () => {
	it("valide les bornes du coefficient CRM bonus-malus (0.50 à 3.50)", () => {
		const profile = {
			contactId: "ct_001",
			crmCoefficient: 0.5,
			claimsCount36Months: 0,
			atFaultClaims: 0,
		};
		expect(CreateDriverProfileInputSchema.parse(profile).crmCoefficient).toBe(
			0.5,
		);

		// Malus maximal valide
		expect(
			CreateDriverProfileInputSchema.parse({ ...profile, crmCoefficient: 3.5 })
				.crmCoefficient,
		).toBe(3.5);

		// En dessous du bonus maximum légal français (0.50) -> Rejet
		expect(() =>
			CreateDriverProfileInputSchema.parse({ ...profile, crmCoefficient: 0.4 }),
		).toThrow();

		// Au dessus du malus maximal légal (3.50) -> Rejet
		expect(() =>
			CreateDriverProfileInputSchema.parse({ ...profile, crmCoefficient: 3.6 }),
		).toThrow();
	});
});

describe("QA Test Suite: Souscription & Garanties Auto", () => {
	it("valide une création de dossier d'assurance avec options", () => {
		const dossier = {
			contactId: "ct_001",
			vehicleId: "veh_001",
			driverProfileId: "drv_001",
			formula: "TOUS_RISQUES" as const,
			options: {
				assistance0km: true,
				vehiculePret: true,
				protectionJuridique: true,
				valeurMajoree: false,
				conducteurRenforce: true,
			},
			annualPremiumTTC: 750.5,
			monthlyPayment: 62.54,
		};
		const parsed = CreateInsuranceDossierInputSchema.parse(dossier);
		expect(parsed.formula).toBe("TOUS_RISQUES");
		expect(parsed.options?.assistance0km).toBe(true);
		expect(parsed.annualPremiumTTC).toBe(750.5);
	});

	it("valide la transition de statut d'un dossier vers VALIDE_SOUSCRIT avec numéro de police", () => {
		const update = {
			dossierId: "dos_123",
			status: "VALIDE_SOUSCRIT" as const,
			policeNumber: "POL-APRIL-88719",
		};
		const parsed = UpdateDossierStatusInputSchema.parse(update);
		expect(parsed.status).toBe("VALIDE_SOUSCRIT");
		expect(parsed.policeNumber).toBe("POL-APRIL-88719");
	});
});

describe("QA Test Suite: Rapprochement des Bordereaux Grossistes", () => {
	it("valide le format de période YYYY-MM et les montants d'un bordereau", () => {
		const statement = {
			brokerPartnerId: "bp_maxance",
			statementPeriod: "2026-09",
			originalFilename: "bordereau_maxance_09_2026.csv",
			lines: [
				{
					partnerContractRef: "MAX-9091",
					clientName: "Sarah Benali",
					actualAmount: 112.5,
					commissionType: "ACQUISITION_ONE_SHOT" as const,
				},
				{
					partnerContractRef: "MAX-9092",
					clientName: "Alexandre Martin",
					actualAmount: 14.2,
					commissionType: "RECURRENT_ENCAISSEMENT" as const,
				},
			],
		};
		const parsed = ImportCommissionStatementInputSchema.parse(statement);
		expect(parsed.statementPeriod).toBe("2026-09");
		expect(parsed.lines.length).toBe(2);

		// Format de période invalide -> Rejet
		expect(() =>
			ImportCommissionStatementInputSchema.parse({
				...statement,
				statementPeriod: "Septembre-2026",
			}),
		).toThrow();
	});
});
