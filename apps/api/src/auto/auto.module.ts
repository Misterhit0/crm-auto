import { Module } from "@nestjs/common";
import { AutoInsuranceService } from "./auto-insurance.service";
import { SivService } from "./siv.service";
import { AutoInsuranceRouter } from "./auto.router";

@Module({
	providers: [AutoInsuranceService, SivService, AutoInsuranceRouter],
	exports: [AutoInsuranceService, SivService],
})
export class AutoModule {}
