import "@crm/env/load";
import { db } from "../src/client";

const prisma = db;

async function main() {
	console.log("🌱 Seeding des partenaires grossistes & données de démonstration...");

	// 1. Création des partenaires grossistes de référence en assurance auto
	const partners = [
		{
			name: "April Auto",
			contactName: "Jean-Marc Dupont",
			email: "courtage@april-auto.fr",
			phone: "04 72 36 73 73",
			portalUrl: "https://hub.april.fr",
			defaultAcquisitionCommission: 80.0,
			defaultRenewCommissionRate: 0.08,
		},
		{
			name: "Maxance",
			contactName: "Valérie Lambert",
			email: "partenaires@maxance.com",
			phone: "01 41 86 27 00",
			portalUrl: "https://courtier.maxance.com",
			defaultAcquisitionCommission: 90.0,
			defaultRenewCommissionRate: 0.07,
		},
		{
			name: "Solly Azar",
			contactName: "Patrick Martin",
			email: "animateur@sollyazar.com",
			phone: "01 40 06 18 00",
			portalUrl: "https://espace-courtier.sollyazar.com",
			defaultAcquisitionCommission: 100.0,
			defaultRenewCommissionRate: 0.08,
		},
		{
			name: "Netvox Assurances",
			contactName: "Sophie Bernard",
			email: "contact@netvox.fr",
			phone: "01 55 58 10 00",
			portalUrl: "https://extranet.netvox.fr",
			defaultAcquisitionCommission: 85.0,
			defaultRenewCommissionRate: 0.075,
		},
	];

	for (const p of partners) {
		const existing = await prisma.brokerPartner.findFirst({ where: { name: p.name } });
		if (!existing) {
			await prisma.brokerPartner.create({ data: p });
			console.log(`  + Grossiste ajouté : ${p.name}`);
		}
	}

	// 2. Création d'un premier client contact
	let contact = await prisma.contact.findFirst({ where: { email: "alexandre.martin@example.com" } });
	if (!contact) {
		contact = await prisma.contact.create({
			data: {
				firstName: "Alexandre",
				lastName: "Martin",
				email: "alexandre.martin@example.com",
				phone: "06 12 34 56 78",
			},
		});
		console.log(`  + Contact client créé : ${contact.firstName} ${contact.lastName}`);
	}

	// 3. Création du véhicule (Peugeot 208)
	let vehicle = await prisma.vehicle.findFirst({ where: { licensePlate: "AB-123-CD" } });
	if (!vehicle) {
		vehicle = await prisma.vehicle.create({
			data: {
				contactId: contact.id,
				licensePlate: "AB-123-CD",
				brand: "PEUGEOT",
				model: "208 II",
				version: "1.2 PureTech 100ch Allure S&S",
				fiscalPower: 5,
				fuelType: "ESSENCE",
				usage: "PRIVE_TRAJET",
				parking: "GARAGE_FERME",
				annualMileage: 15000,
				firstRegistrationDate: new Date("2022-06-15"),
				vin: "VF3UPHNKMPW123456",
			},
		});
		console.log(`  + Véhicule ajouté : ${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`);
	}

	// 4. Profil Conducteur (Bonus 0.50)
	let driver = await prisma.driverProfile.findFirst({ where: { contactId: contact.id } });
	if (!driver) {
		driver = await prisma.driverProfile.create({
			data: {
				contactId: contact.id,
				licenseNumber: "12AB34567",
				licenseDate: new Date("2014-03-20"),
				licenseType: "B",
				crmCoefficient: 0.50,
				claimsCount36Months: 0,
				atFaultClaims: 0,
				glassBreakageClaims: 0,
				parkingTheftClaims: 0,
				insuranceHistoryMonths: 36,
			},
		});
		console.log(`  + Profil Conducteur créé : Bonus ${driver.crmCoefficient}`);
	}

	// 5. Création d'un dossier souscrit avec April Auto
	const april = await prisma.brokerPartner.findFirst({ where: { name: "April Auto" } });
	const existingDossier = await prisma.insuranceDossier.findFirst({ where: { contactId: contact.id } });
	if (!existingDossier && april) {
		const dossier = await prisma.insuranceDossier.create({
			data: {
				reference: "DOS-2026-00001",
				contactId: contact.id,
				vehicleId: vehicle.id,
				driverProfileId: driver.id,
				brokerPartnerId: april.id,
				formula: "TOUS_RISQUES",
				status: "VALIDE_SOUSCRIT",
				annualPremiumTTC: 480.0,
				annualPremiumHT: 400.0,
				monthlyPayment: 40.0,
				effectiveDate: new Date(),
				anniversaryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
				policeNumber: "AP-AUTO-984512",
			},
		});
		console.log(`  + Dossier souscrit créé : ${dossier.reference} (${dossier.policeNumber})`);

		// Ligne de commission
		await prisma.commissionRecord.create({
			data: {
				dossierId: dossier.id,
				type: "ACQUISITION_ONE_SHOT",
				status: "EN_ATTENTE",
				expectedAmount: april.defaultAcquisitionCommission || 80.0,
				partnerContractRef: "AP-AUTO-984512",
			},
		});
		console.log(`  + Commission prévisionnelle créée : 80.00 €`);
	}

	console.log("✅ Seed terminé avec succès !");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
