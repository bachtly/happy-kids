# How to maintain database scripts

## Steps when you change schema

1) Update schema from https://dbdiagram.io/d/637ec360c9abfc611174dbbc
2) **Maintain dbdiagram**  at `./schema.dbdiagram` (copy from web to file)
3) **Maintain MySQL schema script** at `./schema.sql` (copy from exported MySQL file from dbdiagram). Remember
   to keep file in structure as:

```
DROP SCHEMA IF EXISTS `KindergartenSchema`;

BEGIN TRANSACTION;

**YOUR SCHEMA**

COMMIT;
```

4) **Maintain seed MySQL script** at `./seed.sql`. Please keep the structure of it as the schema script above (
   use TRANSACTION);
5) Run scripts on your local db to make sure they work as expected

## Issues Q/A

1) Command `DELETE FROM Table;` is not allowed.
   => Go to Edit -> Preferences -> SQL Editor and Deselect the option `Safe Updates`. Restart MySQL Workbench.
2) Why should we maintain **dbdiagram script**?
   => The Object structure on dbdiagram is easier to maintain. SQL scripts have a lot more contraints (think about the
   order of commands of foreign keys).