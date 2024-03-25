use time::{format_description, PrimitiveDateTime};

pub fn format_date(date: Option<PrimitiveDateTime>) -> String {
    date.unwrap()
        .format(&format_description::parse("[day].[month].[year], [hour]:[minute]").unwrap())
        .unwrap()
}

#[macro_export]
macro_rules! getenv {
    ($envvar:expr) => {
        std::env::var($envvar).expect(format!("should specify `{}` in .env file",$envvar).as_str())
    };
    ($envvar:expr, $type:ty) => {
        getenv!($envvar)
            .parse::<$type>()
            .expect(format!( "{} should be of type {}",$envvar, stringify!($type)).as_str())
    };
}
