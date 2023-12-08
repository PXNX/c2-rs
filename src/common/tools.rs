use ammonia::clean;
use pulldown_cmark::{Options, Parser};
use pulldown_cmark::html::push_html;
use time::{format_description, PrimitiveDateTime};

pub fn format_date(date: Option<PrimitiveDateTime>) -> String {
    date.expect("date is None")
        .format(&format_description::parse("[day].[month].[year], [hour]:[minute]")
            .expect("format description parse failed"))
        .expect("date format failed")
}

pub fn clean_html(text: &str) -> String {
    let options = Options::ENABLE_TABLES;
    let md_parse = Parser::new_ext(text, options);

    let mut unsafe_html = String::new();
    push_html(&mut unsafe_html, md_parse);

    clean(&*unsafe_html)
}
