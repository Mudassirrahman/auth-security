import { EntityBase } from "src/base/base.entity";
import { Column, Entity, Index } from "typeorm";

@Entity("user")
export class UserEntity extends EntityBase{
    @Column()
    @Index({ unique: true })
    firstname : string;

    @Column()
    lastname: string;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    password: string;


    @Column()
    age: number;

   


}