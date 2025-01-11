import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Tenant } from "./Tenant";
import { Image } from "./Image";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: "CASCADE" })
  tenant?: Tenant;

  @OneToMany(() => Image, (image) => image.createdBy)
  images: Image[];
}