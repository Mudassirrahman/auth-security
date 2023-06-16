import { EntityBase } from "src/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity("user")
export class UserEntity extends EntityBase{
    @Column()
    firstname : string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;


    @Column()
    age: number;

    


}