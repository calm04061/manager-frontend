/*!
# frontend description
## Features
## Usage
Add dependency to Cargo.toml:
```toml
[dependencies]
frontend = "0.1"
```
*/

// use actix_web_static_files;

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

pub fn config_web(cfg: &mut actix_web::web::ServiceConfig) {
    let generated = generate();
    cfg.service(
        actix_web_static_files::ResourceFiles::new("/", generated)
            .resolve_not_found_to_root(),
    );
}
