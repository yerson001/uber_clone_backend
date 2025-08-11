import { ClientRequests } from "src/client_requests/client_requests.entity";
import { DriverCarInfo } from "src/driver_car_info/driver_car_info.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'driver_trip_offers'})
export class DriverTripOffers {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_driver: number;

    @Column()
    id_client_request: number;

    @Column()
    fare_offered: string;

    @Column('decimal', {precision: 10, scale: 2})
    time: number;

    @Column('decimal', {precision: 10, scale: 2})
    distance: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
    
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'id_driver' })
    driver: User;

    @ManyToOne(() => ClientRequests, (clientRequests) => clientRequests.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'id_client_request' })
    clientRequests: ClientRequests;

    

}