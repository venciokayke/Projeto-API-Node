import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Product_Situations } from "./Product_Situations";
import { Product_Categories } from "./Product_Categories";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @Column({ type: "longtext", nullable: true })
    description!: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    price!: string | null;

    @ManyToOne(() => Product_Situations, (product_situation) => product_situation.products)
    @JoinColumn({ name: "situationId" })
    productSituation!: Product_Situations;

    @ManyToOne(() => Product_Categories, (product_category) => product_category.products)
    @JoinColumn({ name: "categoryId" })
    productCategory!: Product_Categories; 

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

}
