CREATE DATABASE calabara;

create table organizations (id serial, name text not null, members int not null, website text, discord text, logo text, addresses text ARRAY, verified boolean, ens text UNIQUE, primary key (id));

create table widgets (widget_id serial, ens text not null, name text not null, metadata jsonb, gatekeeper_rules jsonb, primary key(widget_id), foreign key (ens) references organizations(ens) on delete cascade);

create table supported_widgets (supported_widget_id serial, name text not null, link text not null, widget_logo text not null, primary key(supported_widget_id));

create table subscriptions (id serial, address text, subscription text, primary key (id), foreign key (subscription) references organizations(ens) on delete cascade);

create table gatekeeper_rules (rule_id serial, ens text, rule jsonb, primary key (rule_id), foreign key (ens) references organizations(ens) on delete cascade);

create table wiki_groupings (group_id serial, ens text, name text, gk_rules jsonb, primary key (group_id), foreign key (ens) references organizations(ens) on delete cascade);

create table wikis (id serial, ens text, title text, location text, grouping serial, primary key (id), foreign key (grouping) references wiki_groupings(group_id) on delete cascade);

create table discord_guilds (id serial, ens text UNIQUE, guild_id text, primary key (id), foreign key(ens) references organizations(ens) on delete cascade);

create table users (id serial, address text UNIQUE, discord text, nonce text, primary key(id));

create table whitelist (id serial, address text, primary key (id));


/* contest setup experimentation*/

create table contests (id serial, ens text, created text, _start text, _end text, _hash text UNIQUE, _url text, primary key (id));
create table contest_submissions (id serial, ens text, contest_hash text, created text, author text, locked boolean, pinned boolean, _url text, primary key(id), foreign key(contest_hash) references contests(_hash) on delete cascade);