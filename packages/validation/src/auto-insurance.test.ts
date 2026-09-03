import { describe, expect, it } from "bun:test";
import {
	FuelTypeSchema,
	VehicleUsageSchema,
	ParkingTypeSchema,
	DossierStatusSchema,
	FormulaTypeSchema,
	DocumentTypeSchema,
	CreateDriverProfileInputSchema,
	CreateVehicleInputSchema,
	CreateInsuranceDossierInputSchema,
	ImportCommissionStatementInputSchema,
} from "./auto-insurance";

describe("Auto Insurance Validation & Calculations (QA Suite)", () => {
	it("valide correctement les types de carburants SIV", () => {
		expect(FuelTypeSchema.parse("ESSENCE")).toBe("ESSENCE");
		expect(FuelTypeSchema.parse("DIESEL")).toBe("DIESEL");
		expect(FuelTypeSchema.parse("HYBRIDE_ESSENCE")).toBe("HYBRIDE_ESSENCE");
		expect(() => FuelTypeSchema.parse("HYDROGENE_INCONNU")).toThrow();
	});

	it("valide les formules d'assurance et leurs garanties", () => {
		expect(FormulaTypeSchema.parse("TIERS_SIMPLE")).toBe("TIERS_SIMPLE");
		expect(FormulaTypeSchema.parse("TIERS_ETENDU_VOL_INCENDIE")).toBe("TIERS_ETENDU_VOL_INCENDIE");
		expect(FormulaTypeSchema.parse("TOUS_RISQUES")).toBe("TOUS_RISQUES");
		expect(() => FormulaTypeSchema.parse("FORMULE_INVALIDE")).toThrow();
	});

	it("valide les statuts de dossier et la détection d'anomalie documentaire (Priorité A.1)", () => {
		expect(DossierStatusSchema.parse("PIECES_EN_ATTENTE")).toBe("PIECES_EN_ATTENTE");
		expect(DossierStatusSchema.parse("DOSSIER_COMPLET")).toBe("DOSSIER_COMPLET");
		expect(DocumentTypeSchema.parse("RELEVE_INFORMATION")).toBe("RELEVE_INFORMATION");
		expect(DocumentTypeSchema.parse("PERMIS_CONDUIRE")).toBe("PERMIS_CONDUIRE");
	});

	it("valide un profil conducteur avec son coefficient CRM bonus/malus", () => {
		const validProfile = {
			contactId: "contact_123",
			licenseNumber: "15AB12345",
			licenseDate: new Date("2015-04-12"),
			licenseType: "B",
			crmCoefficient: 0.5,
			claimsCount36Months: 0,
			atFaultClaims: 0,
		};
		const parsed = CreateDriverProfileInputSchema.parse(validProfile);
		expect(parsed.crmCoefficient).toBe(0.5);
		expect(parsed.atFaultClaims).toBe(0);
	});

	it("valide un véhicule qualifié par SIV (Plaque, Marque, Modèle, VIN)", () => {
		const validVehicle = {
			contactId: "contact_123",
			licensePlate: "AB-123-CD",
			brand: "PEUGEOT",
			model: "208 II 1.2 PureTech",
			version: "Allure S&S",
			firstRegistrationDate: new Date("2022-06-15"),
			fiscalPower: 5,
			fuelType: "ESSENCE" as const,
			usage: "PRIVE_TRAJET" as const,
			parking: "GARAGE_FERME" as const,
		};
		const parsed = CreateVehicleInputSchema.parse(validVehicle);
		expect(parsed.licensePlate).toBe("AB-123-CD");
		expect(parsed.brand).toBe("PEUGEOT");
		expect(parsed.fuelType).toBe("ESSENCE");
	});

	it("valide la structure d'import de bordereau grossiste (Rapprochement)", () => {
		const statement = {
			brokerPartnerId: "bp_april_123",
			statementPeriod: "2026-09",
			originalFilename: "bordereau_april_auto_sept_2026.xlsx",
			lines: [
				{
					partnerContractRef: "POL-APRIL-9912",
					clientName: "Alexandre Martin",
					licensePlate: "AB-123-CD",
					commissionType: "ACQUISITION_ONE_SHOT" as const,
					actualAmount: 85.0,
					dossierReference: "DOS-2026-0012",
				},
			],
		};
		const parsed = ImportCommissionStatementInputSchema.parse(statement);
		expect(parsed.statementPeriod).toBe("2026-09");
		expect(parsed.lines.length).toBe(1);
		expect(parsed.lines[0]?.actualAmount).toBe(85.0);
	});
});
