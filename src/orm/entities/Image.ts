import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Tenant } from "./Tenant";
import { User } from "./User";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.images, { onDelete: "CASCADE" })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.images, { onDelete: "SET NULL" })
  createdBy: User;
}