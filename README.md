# db-meta

Relational database metadata extraction library

The following databases are currently supported:

 * SQLite3 - via: [node-sqlite3](https://github.com/developmentseed/node-sqlite3)
 * MySQL - via: [node-mysql](https://github.com/felixge/node-mysql)
 * PostgreSQL - via: [node-postgres](https://github.com/brianc/node-postgres)


## Installation

    $ npm install db-meta

You'll also need to install the appropriate driver for the database you want to
use db-meta with. None are installed by default.

    # PostgreSQL
    $ npm install pg

    # MySQL
    $ npm install mysql

    # SQLite3
    $ npm install sqlite3


## Example Usage

```javascript
var dbmeta = require('db-meta');

dbmeta('pg', { database: 'test' }, function(meta) {
  meta.getVersion(function(err, version) {
    console.log('postgres version is ' + version);
  });

  meta.getTables(function(tables) {
    tables.forEach(function(table) {
      console.log('table name is ' + table.getName());
    });
  });

  meta.getColumns('tablename', function(columns) {
    columns.forEach(function(column) {
      console.log('column name is ' + column.getName());
      console.log('column data type is ' + column.getDataType());
      console.log('column is nullable? ' + column.isNullable());
      console.log('column max length is ' + column.getMaxLength());
    });
  });
});
```

## API

### require('db-meta')(driver, options, callback)

Creates a connection to the database using the specified driver. The options object is passed to the specified
driver object.

__Arguments__

* driver - the name of the db-meta driver to use
* options - an options object passed to the db-meta driver to use when connecting to the database
* callback(err, driver) - callback that will be invoked after connecting to the database

The user may pass a connection object in the options argument using the key connection. If this key is included in the options object, the driver will attempt to use the existing connection.

### driver.getVersion(callback)

Get the version of the connected database

__Arguments__

* callback(err, version) - callback invoked with the version information


### driver.getTables(callback)

Get an array of table objects representing all user tables in the database

__Arguments__

* callback(err, tables) - callback invoked with an array of tables. See the table API
below for details on the methods available on table objects


### Table.getName()

Returns the table's name


### driver.getColumns(callback)

Get an array of column objects representing all user columns in the database

__Arguments__

* callback(err, columns) - callback invoked with an array of columns. See the column API
below for details on the methods available on column objects

### Column.getName()

Returns the columns name

### Column.isNullable()

Returns true if the column is nullable, false otherwise

### Column.getDataType()

Returns the data type of the column. See `lib/data-type.js` for a list of valid data types

### Column.getMaxLength()

Returns the max length of the column, if constrained. Only valid for textual columns.

### Column.isPrimaryKey()

Returns true if the column is the primary key, false otherwise

### Column.getDefaultValue()

Returns the default value for the column

## Testing

To run the tests you'll need a local installation of PostgreSQL, MySQL, and SQLite3 with default user
accounts. You'll also need to create a schema named `db_meta_test` beforehand (excluding SQLite3) and
install the npm dev dependencies. Finally, you can run all the tests with

    $ npm test

## License

(The MIT License)

Copyright (c) 2012 Near Infinity Corporation

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
