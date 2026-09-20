import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from "typeorm"
import { Product } from "./Products";

@Entity("product_categories")
export class Product_Categories {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    name!: string;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

    @OneToMany(() => Product, (Product) => Product.productCategory)
    products!: Product[]; 
}