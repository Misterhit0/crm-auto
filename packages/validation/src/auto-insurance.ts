import { z } from "zod";

// ==========================================
// ENUMS & SCHEMAS AUTOMOBILE
// ==========================================

export const FuelTypeSchema = z.enum([
	"ESSENCE",
	"DIESEL",
	"ELECTRIQUE",
	"HYBRIDE_ESSENCE",
	"HYBRIDE_DIESEL",
	"GPL",
	"AUTRE",
]);
export type FuelType = z.infer<typeof FuelTypeSchema>;

export const VehicleUsageSchema = z.enum([
	"PRIVE_TRAJET",
	"PROFESSIONNEL_COMMERCIAL",
	"TOURNÉE_LIVRAISON",
	"TOUS_DEPLACEMENTS",
]);
export type VehicleUsage = z.infer<typeof VehicleUsageSchema>;

export const ParkingTypeSchema = z.enum([
	"GARAGE_FERME",
	"JARDIN_CLOS",
	"VOIE_PUBLIQUE",
	"PARKING_COLLECTIF_FERME",
]);
export type ParkingType = z.infer<typeof ParkingTypeSchema>;

export const DossierStatusSchema = z.enum([
	"PROSPECT_INITIE",
	"PIECES_EN_ATTENTE",
	"DOSSIER_COMPLET",
	"DEVIS_EMIS",
	"VALIDE_SOUSCRIT",
	"ACTIF",
	"RESILIE",
	"SANS_SUITE",
]);
export type DossierStatus = z.infer<typeof DossierStatusSchema>;

export const FormulaTypeSchema = z.enum([
	"TIERS_SIMPLE",
	"TIERS_ETENDU_VOL_INCENDIE",
	"TOUS_RISQUES",
	"TOUS_RISQUES_CONFORT",
]);
export type FormulaType = z.infer<typeof FormulaTypeSchema>;

export const DocumentTypeSchema = z.enum([
	"PERMIS_CONDUIRE",
	"CARTE_GRISE",
	"RELEVE_INFORMATION",
	"RIB",
	"DEVIS_SIGNE",
	"MANDAT_PRELEVEMENT",
	"PIECE_IDENTITE",
	"AUTRE",
]);
export type DocumentType = z.infer<typeof DocumentTypeSchema>;

export const CommissionTypeSchema = z.enum([
	"ACQUISITION_ONE_SHOT",
	"RECURRENT_ENCAISSEMENT",
	"HONORAIRES_CONSEIL",
]);
export type CommissionType = z.infer<typeof CommissionTypeSchema>;

export const CommissionStatusSchema = z.enum([
	"EN_ATTENTE",
	"RAPPROCHE_VALIDE",
	"ANOMALIE_ECART",
	"IMPAYE",
	"ANNULE",
]);
export type CommissionStatus = z.infer<typeof CommissionStatusSchema>;

// ==========================================
// VÉHICULE & SIV
// ==========================================

export const SivLookupInputSchema = z.object({
	licensePlate: z
		.string()
		.min(5, "Format d'immatriculation trop court")
		.max(12, "Format d'immatriculation trop long")
		.transform((val) => val.toUpperCase().replace(/[\s-]/g, "")),
});
export type SivLookupInput = z.infer<typeof SivLookupInputSchema>;

export const SivLookupOutputSchema = z.object({
	licensePlate: z.string(),
	vin: z.string().optional(),
	brand: z.string(),
	model: z.string(),
	version: z.string().optional(),
	firstRegistrationDate: z.string().optional(),
	fiscalPower: z.number().int().optional(),
	fuelType: FuelTypeSchema.default("ESSENCE"),
	rawPayload: z.record(z.string(), z.unknown()).optional(),
});
export type SivLookupOutput = z.infer<typeof SivLookupOutputSchema>;

export const CreateVehicleInputSchema = z.object({
	contactId: z.string(),
	licensePlate: z.string().min(1),
	vin: z.string().optional(),
	brand: z.string().min(1),
	model: z.string().min(1),
	version: z.string().optional(),
	firstRegistrationDate: z.date().optional(),
	fiscalPower: z.number().int().optional(),
	fuelType: FuelTypeSchema.default("ESSENCE"),
	usage: VehicleUsageSchema.default("PRIVE_TRAJET"),
	parking: ParkingTypeSchema.default("VOIE_PUBLIQUE"),
	annualMileage: z.number().int().positive().optional(),
	purchaseDate: z.date().optional(),
	sivRawData: z.record(z.string(), z.unknown()).optional(),
});
export type CreateVehicleInput = z.infer<typeof CreateVehicleInputSchema>;

// ==========================================
// CONDUCTEUR & SINISTRALITÉ
// ==========================================

export const CreateDriverProfileInputSchema = z.object({
	contactId: z.string(),
	licenseNumber: z.string().optional(),
	licenseDate: z.date().optional(),
	licenseType: z.string().default("B"),
	crmCoefficient: z.number().min(0.5).max(3.5).default(1.0),
	claimsCount36Months: z.number().int().min(0).default(0),
	atFaultClaims: z.number().int().min(0).default(0),
	glassBreakageClaims: z.number().int().min(0).default(0),
	parkingTheftClaims: z.number().int().min(0).default(0),
	insuranceHistoryMonths: z.number().int().min(0).default(36),
	cancellationHistory: z.string().optional(),
	suspensionHistory: z.boolean().default(false),
});
export type CreateDriverProfileInput = z.infer<
	typeof CreateDriverProfileInputSchema
>;

// ==========================================
// DOSSIER ASSURANCE
// ==========================================

export const CreateInsuranceDossierInputSchema = z.object({
	contactId: z.string(),
	vehicleId: z.string(),
	driverProfileId: z.string(),
	brokerPartnerId: z.string().optional(),
	formula: FormulaTypeSchema.default("TOUS_RISQUES"),
	options: z
		.object({
			assistance0km: z.boolean().default(true),
			vehiculePret: z.boolean().default(false),
			protectionJuridique: z.boolean().default(true),
			valeurMajoree: z.boolean().default(false),
			conducteurRenforce: z.boolean().default(false),
		})
		.optional(),
	annualPremiumTTC: z.number().positive().optional(),
	annualPremiumHT: z.number().positive().optional(),
	monthlyPayment: z.number().positive().optional(),
	effectiveDate: z.date().optional(),
	anniversaryDate: z.date().optional(),
});
export type CreateInsuranceDossierInput = z.infer<
	typeof CreateInsuranceDossierInputSchema
>;

export const UpdateDossierStatusInputSchema = z.object({
	dossierId: z.string(),
	status: DossierStatusSchema,
	policeNumber: z.string().optional(),
});
export type UpdateDossierStatusInput = z.infer<
	typeof UpdateDossierStatusInputSchema
>;

// ==========================================
// COMMISSIONS & BORDEREAUX
// ==========================================

export const ImportCommissionStatementInputSchema = z.object({
	brokerPartnerId: z.string(),
	statementPeriod: z
		.string()
		.regex(
			/^\d{4}-\d{2}$/,
			"Format de période attendu : YYYY-MM (ex: 2026-09)",
		),
	originalFilename: z.string(),
	fileUrl: z.string().optional(),
	lines: z.array(
		z.object({
			partnerContractRef: z.string(),
			clientName: z.string().optional(),
			licensePlate: z.string().optional(),
			commissionType: CommissionTypeSchema.default("ACQUISITION_ONE_SHOT"),
			actualAmount: z.number(),
			dossierReference: z.string().optional(),
		}),
	),
});
export type ImportCommissionStatementInput = z.infer<
	typeof ImportCommissionStatementInputSchema
>;
