use crate::common::models::EquipmentType::{MBT, VSHORAD};

pub struct User {
    id: i64,
    name: String,
    skill_0: i32,
    skill_1: i32,
    skill_2: i32,
}

pub struct Article {}


pub enum EquipmentType {
    MBT,
    VSHORAD,
    APC,
}

pub struct Equipment {
    pub id: i64,
    pub name: String,
    pub avatar: String,
    pub amount: i64,
    pub equipment_type: EquipmentType,
    pub soft_damage: i64,
    pub hard_damage: i64,
    pub health: i64,
    pub armor: i64,

    pub fuel_consumption: i64,
    pub production_time: i64,
    pub resource_costs: Vec<i64>,

}

pub fn get_producible_equipment() -> Vec<Equipment> {
    let equipment_production = vec![
        Equipment {
            id: 0,
            name: "Leopard 2A6".to_string(),
            avatar: "/dist/leopard2.webp".to_string(),
            amount: 6,
            equipment_type: MBT,
            soft_damage: 20,
            hard_damage: 120,
            health: 1000,
            armor: 200,
            fuel_consumption: 20,
            production_time: 10_000,
            resource_costs: vec![
                100, 200,
            ],
        },
        Equipment {
            id: 1,
            name: "FakPz Gepard".to_string(),
            avatar: "/dist/gepard.webp".to_string(),
            amount: 4,
            equipment_type: VSHORAD,
            soft_damage: 40,
            hard_damage: 10,
            health: 600,
            armor: 150,
            fuel_consumption: 14,
            production_time: 8_000,
            resource_costs: vec![
                80, 100,
            ],
        },
    ];

    equipment_production
}

