use time::{format_description, PrimitiveDateTime};

pub fn format_date(date: Option<PrimitiveDateTime>) -> String {
    date.unwrap()
        .format(&format_description::parse("[day].[month].[year], [hour]:[minute]").unwrap())
        .unwrap()
}

