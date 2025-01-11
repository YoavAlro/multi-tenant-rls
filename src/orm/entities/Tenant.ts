import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";
import { Image } from "./Image";

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Image, (image) => image.tenant)
  images: Image[];
}