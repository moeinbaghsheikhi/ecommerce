import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IpRecord } from "src/ip-tracker/entities/ip-record.entity";
import { Repository } from "typeorm";

@Injectable()
export class CleanupJob {
    constructor(
        @InjectRepository(IpRecord)
        private readonly ipRepository: Repository<IpRecord>
    ){}
    async cleanOtp(){
        const records = await this.ipRepository.find()
        let isDeleteRecord = false
        let deletedRecord = ""
        for(const record of records){
            if(record.blockUntil < new Date()){
                isDeleteRecord = true
                deletedRecord += (record.id + ", ")
                await this.ipRepository.delete({id: record.id})
            }
        }

        if(isDeleteRecord) console.log(`records: ${deletedRecord} deleted successfuly✅❌`)
    }
}