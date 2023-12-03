use ammonia::clean;
use pulldown_cmark::{Options, Parser};
use pulldown_cmark::html::push_html;
use time::{format_description, PrimitiveDateTime};

pub fn format_date(date: Option<PrimitiveDateTime>) -> String {
    date.unwrap()
        .format(&format_description::parse("[day].[month].[year], [hour]:[minute]").unwrap())
        .unwrap()
}

pub fn clean_html(text: &str) -> String {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);


    let md_parse: Parser = Parser::new_ext(text, options);


    let mut unsafe_html = String::new();
    push_html(&mut unsafe_html, md_parse);

    clean(&*unsafe_html)
}
