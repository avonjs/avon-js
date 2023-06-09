**Installation**

- [Requirements](#requirements)
- [Installation](#installation)
- [Initialize](#initialize)

**Resources**

- [The basics](#introduction)
  - [Defining Resources](#defining-resources)
  - [Registering Resources](#registering-resources)
  - [Configuring Swagger UI](#configuring-swagger-ui)
  - [Resource Hooks](#resource-hooks)
- [Fields](#defining-fields)
  - [Showing / Hiding Fields](#showing--hiding-fields)
  - [Dynamic Field Methods](#dynamic-field-methods)
  - [Default Values](#default-values)
  - [Field Hydration](#field-hydration)
  - [Orderable Fields](#orderable-fields)
  - [Filterable Fields](#filterable-fields)
  - [Field Types](#field-types)
  - [Customization](#customization)
  - [Nullable Fields](#nullable-fields)
  - [Filterable Fields](#filterable-fields)
- [Relationships](#relationships)
  - [BelongsTo](#belongsto)
  - [HasMany](#hasmany)
  - [HasOne](#hasone)
  - [BelongsToMany](#belongstomany)
  - [Customization](#customization)
- [Validation](#validation)
  - [Rules](#attaching-rules)
  - [Creation Rules](#creation-rules)
  - [Update Rules](#update-rules)
- [Authorization](#authorization)

**Repositories**

- [Defining Repositories](#defining-repositories)
- [Defining Models](#defining-models)

**Filters**

- [Defining Filters](#defining-filters)
- [Registering Filters](#registering-filters)
- [Authorization Filters](#authorization-filters)

**Orderings**

- [Defining Orderings](#defining-orderings)
- [Registering Orderings](#registering-orderings)
- [Authorization Orderings](#authorization-orderings)

**Actions**

- [Defining Actions](#defining-actions)
- [Action Fields](#action-fields)
- [Registering Actions](#registering-actions)
- [Authorization Actions](#authorization-actions)
- [Standalone Actions](#standalone-actions)

**Error Handling**

- [Register Error Handler](#register-error-handler)

# Installation

## Requirements

Avon has a few requirements you should be aware of before installing:

- Node.js (Version 18)
- Expressjs Framework (Version 4.X)

## Installation

via npm:

    npm install avon-js

via yarn:

    yarn install avon-js

## Initialize

At first point you have to register the router:

```
// index.js

import { Avon } from 'avon-js';
import express from 'express';

const app = express();

// register Avon router
app.use('/api', Avon.routes(express.Router()));

app.listen(3000, () => {
  console.log('running')
})

```

# Resources

## Introduction

Avon is a beautiful API generator for Node.js applications written in typescript. Of course, the primary feature of Avon is the ability to administer your underlying repository records. Avon accomplishes this by allowing you to define an Avon `resource` corresponding to each `repository` in your application.

## Defining Resources

To create a Resource you have to create a file and put the following in that:

```
// Resources/Post.js

import { Resource } from 'avon-js';

export default class Post extends Resource {
    /**
    * Get the repository.
    */
    repository() {
        throw new Error('Repository not prepared for resource `post`')
    }
}
```

The most basic and fundamental method of a resource is its `repository`. This method tells Avon which repository the resource corresponds to. So, let's define a repository for our resources.

```
// Repositories/Posts.js


import { CollectionRepository } from 'avon-js';

export default class Posts extends CollectionRepository {

    /**
     * Get searchable attributes.
     */
    searchables() {
        return [];
    }

    /**
     * Get path of the stored files.
     */
    filepath() {
        return process.cwd() + '/posts.json';
    }
}
```

Don't worry, you'll learn more about [repositories](#defining-repositories) later. now the `Post` resource has to change like the following:

```
import Posts from '../Repositories/Posts.js';
import { Resource } from 'avon-js';

export default class Post extends Resource {
    /**
    * Get the repository.
    */
    repository() {
        return new Posts()
    }
}
```

Freshly created Avon resources only contain an `ID` field definition. Don't worry, we'll add more fields to our resource soon.

## Registering Resources

Before resources are available within your API, they must first be registered with Avon. You may use the `resources` method to manually register individual resources:

```
// resources method
Avon.resources([
    New Post(),
])
```

If you do not want a some resource api to appear in the swagger-ui, you may override the following property of your resource class:

- `availableForIndex`
- `availableForDetail`
- `availableForCreation`
- `availableForUpdate`
- `availableForDelete`
- `availableForForceDelete`
- `availableForRestore`

## Configuring Swagger UI

Avon creates a schema based on the [OpenApi](https://github.com/OAI/OpenAPI-Specification) that enables you to use the [swagger-ui](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/installation.md) for documentation. here we using docker to install `swagger-ui`. let's do it:

first run the following command to install swagger-ui:

```
docker pull swaggerapi/swagger-ui
```

now we use the previously [created](#initialize) URL for schema to run docker:

```
docker run -p 80:8080 -e SWAGGER_JSON_URL=http://localhost:3000/api/schema swaggerapi/swagger-ui
```

now you can go to the `http://localhost` and see the result.

**_Attentions_**

- You have to run the server to see the the documentation in the swagger. maybe you need something like this in the root of your project `npm run start`
- If you see `CORS` error when swagger ui loaded the [this](https://expressjs.com/en/resources/middleware/cors.html#installation) tutorial can solve your problem.

## Resource Hooks

Avon also allows you to define the following methods on a resource to serve as hooks that are only invoked when the corresponding resource action is executed from within Avon:

- `afterCreate`
- `beforeCreate`
- `afterUpdate`
- `beforeUpdate`
- `afterDelete`
- `beforeDelete`
- `afterForceDelete`
- `beforeForceDelete`

## Pagination

If you would like to customize the selectable maximum result amounts shown on each resource's "per page" filter menu, you can do so by overriding the `perPageOptions` method:

```
/**
* Get the pagination per-page values
*/
public perPageOptions(): number[] {
    return [15, 25, 50];
}

```

## Defining Fields

Each Avon resource contains a fields method. This method returns an array of fields, which generally extend the `Fields\Field` class. Avon ships with a variety of fields out of the box, including fields for text inputs, booleans, etc.

To add a field to a resource, you may simply add it to the resource's fields method. Typically, fields have to add as new class with accepts several arguments; however, you usually only need to pass the "attribute" name of the field that normally determine the underlying repository storage column:

```
// Resources/Post.js

import { ID, Text } from 'avon-js';


/**
* Get the fields available on the entity.
*/
public fields(request: AvonRequest): Field[] {
    return [
        new ID().filterable().orderable(),
        new Text('name').filterable().orderable(),
    ];
}
```

## Showing / Hiding Fields

Often, you will only want to display a field in certain situations. For example, there is typically no need to show a `Password` field on a resource index listing. Likewise, you may wish to only display a `Created At` field on the creation / update forms. Avon makes it a breeze to hide / show fields on certain pages.

The following methods may be used to show / hide fields based on the display context:

- `showOnIndex`
- `showOnDetail`
- `showOnCreating`
- `showOnUpdating`
- `hideFromIndex`
- `hideFromDetail`
- `hideWhenCreating`
- `hideWhenUpdating`
- `onlyOnIndex`
- `onlyOnDetail`
- `onlyOnForms`
- `exceptOnForms`

You may chain any of these methods onto your field's definition in order to instruct Avon where the field should be displayed:

```
new ID().exceptOnForms()
```

Alternatively, you may pass a callback to that methods as following;
For `show*` methods, the field will be displayed if the given callback returns `true`:

```
new Text('name').exceptOnForms((request, resource) => {
    return resource?.name === 'something';
}),
```

For `hide*` methods, the field will be hidden if the given callback returns `true`:

```
new Text('name').hideFromIndex((request, resource) => {
    return resource?.name === 'something';
}),
```

## Dynamic Field Methods

If your application requires it, you may specify a separate list of fields for specific display contexts. The available methods that may be defined for individual display contexts are:

- `fieldsForIndex`
- `fieldsForDetail`
- `fieldsForCreate`
- `fieldsForUpdate`
- `fieldsForAssociation`

**Dynamic Field Methods Precedence**
The `fieldsForIndex`, `fieldsForDetail`, `fieldsForCreate`, `fieldsForUpdate` and `fieldsForAssociation` methods always take precedence over the `fields` method.

## Default Values

There are times you may wish to provide a default value to your fields. Avon offers this functionality via the `default` method, which accepts callback. The result value of the callback will be used as the field's default input value on the resource's `creation` API:

```
new Text('name').default((request) => 'create something')

```

## Field Hydration

On every create or update request that Avon receives for a given resource, each field's corresponding model attribute will automatically be filled before the model is persisted to the database. If necessary, you may customize the hydration behavior of a given field using the `fillUsing` method:

```
new Text('name').fillUsing((request, model, attribute, requestAttribute) => {
    model.setAttribute(
        attribute,
        request.string(attribute) + ' - ' + Date.now()
    );
}),
```

## Orderable Fields

When attaching a field to a resource, you may use the `orderable` method to indicate that the resource index may be sorted by the given field:

```
new Text('name').orderable()
```

Also its possible to passing a callback to customize the ordering behavior:

```
new Text('name').orderable((request, repository, direction) => {
    repository.order({
        key: 'another key',
        direction: 'desc',
    });
})

```

## Filterable Fields

The `filterable` method allows you to enable convenient, automatic filtering functionality for a given field on the resource's index:

```
new Text('name').filterable()
```

Also its possible to passing a callback to customize the filtering behavior:

```
new Text('name').filterable((request, repository, value) => {
    repository.where({
        key: this.filterableAttribute(request),
        operator: Operator.like,
        value,
    });
})

```

## Field Types

- [Array Field](#array-field)
- [Boolean](#boolean-field)
- [DateTime](#datetime-field)
- [Email Field](#email-field)
- [ID Field](#id-field)
- [Json Field](#json-field)
- [Integer Field](#integer-field)
- [Text Field](#text-field)

### Array Field

The `Array` field pairs nicely with model attributes that are cast to `array` or equivalent:

```
import { Array } from 'avon-js';

new Array('tags')
```

### Boolean Field

The `Boolean` field may be used to represent a boolean / "tiny integer" column in your database. For example, assuming your database has a boolean column named `active`, you may attach a `Boolean` field to your resource like so:

```
import { Boolean } from 'avon-js';


new Boolean('active').rules(Joi.required()).nullable(false)
```

### DateTime

The `DateTime` field may be used to store a `datetime` value.

```
import { DateTime } from 'avon-js';


new DateTime('publish_at'),
```

The `format` method allows you to customize the date format that accepts any valid [moment](https://momentjs.com) formatting.

### Email Field

The `Email` field may be used to store a `email` value.

```
import { Email } from 'avon-js';


new Email('mail'),
```

### ID Field

The `ID` field represents the primary key of your resource's repository model. Typically, each Avon resource you define should contain an `ID` field. By default, the `ID` field assumes the underlying storage column is named `id`; however, you may pass the column name when creating an `ID` field:

```
import { ID } from 'avon-js';

new ID()
```

### Json Field

The `Json` field provides a convenient interface to edit, `key-value` data stored inside `JSON` column types. For example, you might store some information inside a `JSON` column type (opens new window) named `meta`:

```
import { ID, Json, Text } from 'avon-js';

new Json('meta', [
    new Text('title').creationRules(Joi.required()),
])
```

### Integer Field

The `Integer` field store / retrieve value as `integer` in the model:

```
import { Integer } from 'avon-js';

new Integer('hits')
```

## Text Field

The `Text` field store / retrieve value as `string` in the model:

```
import { Text } from 'avon-js';

new Text('name')
```

## Customization

### Nullable Fields

By default, Avon attempts to store all fields with a value, however, there are times where you may prefer that Avon store a `null` value in the corresponding sorage column when the field is empty. To accomplish this, you may invoke the `nullable` method on your field definition:

```
new DateTime('publish_at').nullable()
```

You may also set which values should be interpreted as a `null` value using the `nullValues` method, which accepts an function as validator:

```
new DateTime('publish_at').nullable().nullValues((value) => ['', undefined, null].includes(value));
```

### Filterable Fields

The `filterable` method allows you to enable convenient, automatic filtering functionality for a given field on resources.

```
new Boolean('active').filterable()
```

The `filterable` method also accepts a callback as an argument. This callback will receive the filter query, which you may then customize in order to filter the resource results to your liking:

```
new Boolean('active').filterable((request, repository, value) => {
    repository.where({
    key: 'active',
    operator: Operator.eq,
    value: Boolean(value) ? 1 : 0
    })
})
```

## Relationships

In addition to the variety of fields we've already discussed, Avon has support for some relationships. Avon relation fields allows you to handle relationships between resources.

### BelongsTo

The `BelongsTo` field corresponds to a `belongs-to` relationship. For example, let's assume a `Post` resource belongs to a `User` resource. We may add the relationship to our `Post` Avon resource like so:

```
import { BelongsTo } from 'avon-js';

new BelongsTo('users')
```

As you see, `BelongsTo` accepts the `uriKey` of the target resource as first argument. By default `BelongsTo` field guess the `relationship` name from the target resurce, but you can pass the second argument when creating a field to change that.
In the example above, Avon will will give `user` value from request and store primary key of the `User` resource in the `user_id` attribute of the `Post` resource. to change that you can follow the below example:

```
new BelongsTo('users', 'author')
```

now, Avon retrieve `author` from requestn and store it inthe `author_id` of post attributes.

Avon determines the default foreign key name by examining the name of the `relationship` and suffixing the name with a `_` followed by the name of the parent resource model's primary key column. So, in this example, Avon will assume the `User` model's foreign key on the `posts` repository is `author_id`.

However, if the foreign key for your relationship does not follow these conventions, `withForeignKey` method allows you change the foreign key of the relation:

```
new BelongsTo('users', 'author').withForeignKey('user_id')
```

Also, Avon use the `id` column of the parent model to store as foreign key. If your parent model does not use `id` as its primary key, or you wish to find the associated model using a different column you can use the `withOwnerKey` method to specifying your parent table's custom key:

```
new BelongsTo('users', 'author').withOwnerKey('userId')
```

Now, Avon try to find the realted `user` by `userId`.

#### Nullable Relationships

If you would like your `BelongsTo` relationship to be `nullable`, you may simply chain the nullable method onto the field's definition:

```
new BelongsTo('users', 'author').nullable()
```

#### Load Realted Resource

The `BelongsTo` field only display the realted resource foreign key on the `detail` and `index` API but some times you need to load the realted resource instead of foreign key. for exmaple you want to see the `User` record on the `Post` api. for this situation you can use the `load` method on the `BelongsTo` field:

```
new BelongsTo('users').load()
```

### HasMany

The `HasMany` field corresponds to a `one-to-many` realtionship. A one-to-many relationship is used to define relationships where a single model is the parent to one or more child models. For example, a use may have a many posts in the blog. We may add the relationship to our `User` Avon resource like so:

```
import { HasMany } from 'avon-js';

new HasMany('posts')
```

Like another realtionships, `HasMany` accepts the `uriKey` of the target resource as first argument Also, guess the `relationship` name from the target resurce, but you can pass the second argument when creating a field to change that.

```
import { HasMany } from 'avon-js';

new HasMany('posts', 'latestPosts')
```

Avon determines the default foreign key name by examining the name of the resource and suffixing the name with a `_` followed by the name of the resource model's primary key column. So, in this example, Avon will assume the `User` model's foreign key on the `posts` repository is `user_id` but, the `withForeignKey` method allows you to change this behavior. so let assume the `User` id column stored as `author_id` on the posts record, so exmaple will be change like following:

```
new HasMany('posts', 'latestPosts').withForeignKey('author_id')
```

Also if you are using the another key instead of `id` of the resource, you can change the `HasMany` field like below:

```
new HasMany('posts', 'latestPosts').withOwnerKey('userId')
```

### HasOne

The `HasOne` field corresponds to a `one-to-one` relationship. For example, let's assume a `User` Avon resource hasOne `Profile` Avon resource. this field is like the `HasMany` field, and the only thing that has changed is the result of loaded resourcse that limited only into one. so the following example will load only the one realted resource detail:

```
new HasOne('posts', 'latestPosts').withForeignKey('author_id')
```

### BelongsToMany

The `BelongsToMany` field corresponds to a `many-to-many` relationship. For example, let's assume a `Post` Avon resource has many `Tag` Avon resource and in reverse `Tag` Avon resource has many `Post` Avon resource. to show the realted `Tag` records on the `Post` resource `index` / `detail` api, we need two another more resource to hold the `pivot` table. so we have to create `PostTag` Avon resource to store joining records. we may add the relationship on the `Post` resource like so:

```
import { BelongsToMany } from 'avon-js';

new BelongsToMany('tags', 'post-tags')
```

The `BelongsToMany` field stores the primary key of the resource and realted resource into the pivot resource into attributes by examining the name of the them and suffixing the name with a `_` followed by the name of the model's primary key column. the `setResourceForeignKey` method allows you to cahnge attribute name for the `resource` and `withForeignKey` change the `realted-resource` attribute foreign key name:

```
new BelongsToMany('tags', 'post-tags').setResourceForeignKey('postKey').withForeignKey('tagKey')
```

Also if you are using another key to reffer the resource or the realted resource, `setResourceOwnerKey` and `withOwnerKey` allows to change this attributes like so:

```
new BelongsToMany('tags', 'post-tags').setResourceForeignKey('postKey').withForeignKey('tagKey').setResourceOwnerKey('name').withOwnerKey('name')
```

#### Pivot Fields

If your `belongsToMany` relationship interacts with additional "pivot" fields that are stored on the intermediate table of the many-to-many relationship, you may also attach those to your `BelongsToMany` Avon relationship.

For example, let's assume our `Post` model `belongsToMany` `Tag` resource. On our `post-tag` intermediate storage, let's imagine we have a `order` attribute that contains ordering of relationship. We can attach this `pivot` attribute to the `BelongsToMany` field using the `pivots` method:

```
new BelongsToMany('tags', 'post-tags').pivots((request) => {
    return [
        Integer('order'),
    ];
})
```

#### Load Realted Resource

The `BelongsToMany` field does not display the realted resource on the `detail` and `index` API but the `load` method allows you to meet the attached resurce like so:

```
new BelongsToMany('tags').load()
```

### Customization

### Relatable Resource Formatting

By default, when you load the relationship filds on the resource API, Avon use the index feilds to format the realted resource. If you would like to customize the related resouce attributes on the `parnet` or `child` API, the `fields` method on the relationship fields allows you to pass some feilds to change the display attributes like so:

```
new BelongsTo('users').load().fields((request) => {
    return [
        new Text('name'),
        new ID(),
    ]
})
```

Also on the `BelongsToMany` realtionship you can access `pivot` values:

```
new BelongsToMany('tags').load().fields((request) => {
    return [
        new Text('name'),
        new Integer('order', (value, resource) => {
            return resource.getAttribute('pivot').getAttribute('order')
        })
    ]
})

```

### Relatable Query Filtering

For now, the `BelongsToMany` and `BelongsTo` realtionship field's, allows you to modify their results on the create / update API. for common use case when you want to display the select fields on the UI, you need an API to get realted resource for this fields. Fortunately, Avon create an extra API for this types of realtionships that enables you to have an specific customizeable API for each field. For exmaple, if you have a `BelongsTo` field on the `Post` resource to show the author of the post, you will see an API like `/api/resources/posts/associatable/user` on the swagger-ui. If you would like to customize the association query, you may do so by invoking the `relatableQueryUsing` method:

```
new BelongsTo('users').relatableQueryUsing((request, repository) => {
    return repository.where({
        key: 'role',
        operator: Operator.like,
        value : 'admin'
    })
})
```

### Limiting Relation Results

You can limit the number of results that are returned when searching the field by defining a `relatableSearchResults` property on the class of the resource that you are searching for:

```
/**
* The number of results to display when searching relatable resource.
*/
relatableSearchResults = 5;
```

---

## Validation

Unless you like to live dangerously, any Avon fields that are displayed on the Avon creation / update pages will need some validation. Thankfully, it's a cinch to attach all of the [Joi](https://joi.dev/api) validation rules you're familiar with to your Avon resource fields. Let's get started.

## Attaching Rules

When defining a field on a resource, you may use the `rules` method to attach validation rules to the field:

```
new Text('name').rules(Joi.string())
```

## Creation Rules

If you would like to define rules that only apply when a resource is being created, you may use the `creationRules` method:

```
new Text('name').rules(Joi.string()).creationRules(Joi.required())
```

## Update Rules

Likewise, if you would like to define rules that only apply when a resource is being updated, you may use the `updateRules` method:

```
new Text('name').rules(Joi.string()).creationRules(Joi.required()).updateRules(Joi.optional())
```

## Authorization

When Avon is accessed only by you or your development team, you may not need additional authorization before Avon handles incoming requests. However, if you provide access to Avon to your clients or a large team of developers, you may wish to authorize certain requests. For example, perhaps only administrators may delete records. Thankfully, Avon takes a simple approach to authorization.

### API

To limit which users may `view`, `create`, `update`, `delete`, `forceDelete`, `restore` and `add` resources, you can override the authotization methods:

- `authorizedToviewAny`
- `authorizedToView`
- `authorizedToCreate`
- `authorizedToUpdate`
- `authorizedToDelete`
- `authorizedToForcDelete`
- `authorizedToRestore`
- `authorizedToAdd`

### Disabling Authorization

If you want to disable authorization for specific resource (thus allowing all actions), change `authorizable` method to return `false`:

```
/**
* Determine if need to perform authorization.
*/
public authorizable(): boolean {
    return false;
}
```

### Fields

Sometimes you may want to prevent updating certain fields by a group of users. You may easily accomplish this by chaining the `canSee` method onto your field definition. The `canSee` method accepts a function which should return `true` or `false`. The function will receive the incoming HTTP request:

```
new Boolean('active').canSee((request) => false)
```

# Repositories

## Defining Repositories

To create a repository you have to create a file that conains class extened Avon `Repository` and put the following in that:

```
// Repositories/Collection.js

import { Repository } from "avon-js";

export class MyRepository extends Repository {
    /**
    * Run transaction on the storage.
    * @param callback { () => Promise<T> }
    * @returns {Promise<T>}
    */
    async transaction (callback) {
        throw new Error('Method not implemented');
    }

    /**
    * Search storage for given query string.
    * @param search { string }
    * @param page { number }
    * @param perPage { number }
    * @return {Promise<SearchCollection>}
    */
    async search(search, page, perPage) {
        throw new Error('Method not implemented');
    }

    /**
    * Find all model's for the given conditions.
    * @param key { Where[] }
    * @return {Promise<TModel[]>}
    */
    async all(wheres) {
        throw new Error('Method not implemented');
    }

    /**
    * Find first model for the given conditions.
    * @param key { Where[] }
    * @return {Promise<TModel | undefined>}
    */
    async first(wheres) {
        throw new Error('Method not implemented');
    }

    /**
    * Store given model into the storage.
    * @param key { TModel }
    * @return {Promise<TModel>}
    */
    async store(model) {
        throw new Error('Method not implemented');
    }

    /**
    * Update the given model in storage.
    * @param key { TModel }
    * @return {Promise<TModel>}
    */
    async update(model) {
        throw new Error('Method not implemented');
    }

    /**
    * Delete model for the given key.
    * @param key { string | number }
    * @return {Promise<void>}
    */
    async delete(key) {
        throw new Error('Method not implemented');
    }

    /**
    * Delete model for the given key.
    * @param key { string | number }
    * @return {Promise<void>}
    */
    async forceDelete(key) {
        throw new Error('Method not implemented');
    }

    /**
    * Create new instance of model.
    * @return {TModel}
    */
    async model() {
        throw new Error('Method not implemented');
    }
}
```

Each repository have to return data as a model that should extend the base `Model` like so:

# Filters

## Defining Filters

- [Select Filter](#select-filter)
- [Boolean Filter](#select-filter)
- [Range Filter](#range-filter)

  Avon filters are simple classes that allow you to scope your Avon index queries with custom conditions.

- _Before creating your own filters, you may want to check out [filterable fields](#filterable-fields). Filterable fields can solve the filtering needs of most Avon installations without the need to write custom code._

To create a filter you have to create a javascript class that extends the Avon `Filter` class like so:

```
// Filters/ActivePosts.js


import { Filter } from 'avon-js';

export class ActivePosts extends Filter {
    /**
    * Apply the filter into the given repository.
    */
    apply(request, repository,value) {
        // modify query
    }
}
```

Each filter is a class that extended the base class filters and contains an `apply` method to customize the index query.

### Select Filter

The most common type of Avon filter is the "select" filter, which allows the user to select a filter option from a drop-down selection menu on the swagger-ui. to have a select filter your calss should extend the `SelectFilter`:

```
// Filters/FilterByRoles.js


import { SelectFilter } from 'avon-js';

export class FilterByRoles extends SelectFilter {
    /**
    * Apply the filter into the given repository.
    */
    apply(request, repository, value) {
        // modify query
    }

    /**
    * Get the possible filtering values.
    */
    public options(): any[] {
        return ['admin', 'user'];
    }
}
```

Each `SelectFilter` should have the `options` method that defines the "values" the filter may have.

### Boolean Filter

The Avon "boolean" filters, allow the user to determine a filter should apply on the resource or not. to create a boolean filter you have to create class that extended `BooleanFilter`:

```
// Filters/ActivePosts.js


import { BooleanFilter } from 'avon-js';

export class ActivePosts extends BooleanFilter {
    /**
    * Apply the filter into the given repository.
    */
    apply(request, repository, value) {
        // modify query
    }
}
```

### Range Filter

The "range" filters allow the user to chose records that has a value between a specific range. to create a range filter you have to create class that extended `RangeFilter`:

```
// Filters/FilterByHits.js


import { SelectFilter } from 'avon-js';

export class FilterByHits extends SelectFilter {
    /**
    * Apply the filter into the given repository.
    */
    apply(request, repository, value) {
        // modify query
    }
}
```

## Registering Filters

Once you have defined a filter, you are ready to attach it to a resource. Each resource created by Avon contains a `filters` method. To attach a filter to a resource, you should simply add it to the array of filters returned by this method:

```
/**
* Get the filters available on the entity.
*/
public filters(request: AvonRequest): Filter[] {
    return [
        new ActivePosts(),
    ];
}
```

After attaching a filter to the resource, the filter will appear in the swagger-ui index API.

## Authorization Filters

If fyou need to limit the user to run filters, the `canSee` method gives a `function` that recieve the current request that should return `true` or `false` to dewtermine user can use the filter or not. if an restricted filter apper in the request, the Avon will ignore it:

```
new FilterByHits().canSee((request) => false)
```

# Orderings

## Defining Orderings

Avon orderings are simple classes that allow you to order your Avon index queries with custom conditions.

- _Before creating your own orderings, you may want to check out [orderingable fields](#orderingable-fields). Orderingable fields can solve the orderinging needs of most Avon installations without the need to write custom code._

To create a ordering you have to create a javascript class that extends the Avon `Ordering` class like so:

```
// Orderings/OrderByFullName.js


import { Ordering } from 'avon-js';

export class OrderByFullName extends Ordering {
    /**
    * Apply the ordering into the given repository.
    */
    apply(request, repository, direction) {
        // modify query
    }
}
```

Each ordering is a class that extended the base class orderings and contains an `apply` method to customize the index query.

## Registering Orderings

Once you have defined a ordering, you are ready to attach it to a resource. Each resource created by Avon contains a `orderings` method. To attach a ordering to a resource, you should simply add it to the array of orderings returned by this method:

```
/**
* Get the orderings available on the entity.
*/
public orderings(request: AvonRequest): Ordering[] {
    return [
        new OrderByFullName(),
    ];
}
```

After attaching a ordering to the resource, the ordering will appear in the swagger-ui index API.

## Authorization Orderings

If fyou need to limit the user to run orderings, the `canSee` method gives a `function` that recieve the current request that should return `true` or `false` to dewtermine user can use the ordering or not. if an restricted ordering apper in the request, the Avon will ignore it:

```
new OrderingByHits().canSee((request) => false)
```

# Actions

## Defining Actions

Avon actions allow you to perform custom tasks on one or more resource records. For example, you might write an action that sends an email to a user containing account data they have requested. Or, you might write an action to transfer a group of records to another user.

Once an action has been attached to a resource definition, you can see extra API on the swagger-ui. to create an action you have to create a class that extended by the Avon `Action`:

```
import { Action } from 'avon-js';

export class Publish extends Action {
    /**
    * Perform the action on the given models.
    */
    protected async handle(fields: Fluent, models: Model[]): Promise<Response | undefined> {
        //
    }
}
```

The most important method of an action is the `handle` method. The `handle` method receives the values for any fields attached to the action, as well as a collection of selected models. The `handle` method always receives a Collection of models, even if the action is only being performed against a single model.

Within the `handle` method, you may perform whatever tasks are necessary to complete the action. You are free to update database records, send emails, call other services, etc. The sky is the limit!

## Action Fields

Sometimes you may wish to gather additional information from the user before dispatching an action. For this reason, Avon allows you to attach most of Avon's supported [fields](#fields) directly to an action. To add a field to an action, add the field to the array of fields returned by the action's `fields` method:

```
/**
* Get the fields available on the action.
*/
public fields(request: AvonRequest): Field[] {
    return [];
}
```

## Action Responses

Typically, when an action is executed, a "success" response will create by Avon. However, you are free to return your custom response:

```
/**
* Perform the action on the given models.
*/
protected async handle(fields: Fluent, models: Model[]): Promise<Response | undefined> {
    // did some thing

    return new MyResponse();
}
```

To create a custom response class, you have to create class extended base Avon `Response` class like so:

```
// Actions/Responses/PublishedResponse.js


import { Response } from "avon-js";

export class PublishedResponse extends Response {
  constructor(meta= {}) {
    super(201, {}, { ...meta, type: 'PublishedResponse is my custom response'});
  }
}
```

## Registering Actions

Once you have defined an action, you are ready to attach it to a resource. Each resource created by Avon contains an `actions` method. To attach an action to a resource, you should simply add it to the array of actions returned by this method:

```
/**
* Get the actions available on the entity.
*/
actions(request){
    return [
        new Publish()
    ];
}
```

## Authorization Actions

If you would like to only expose a given action to certain users, you may invoke the `canSee` method when registering your action. The `canSee` method accepts a function which should return `true` or `false`. The function will receive the incoming HTTP request:

```
new Publish().canSee(request => false)
```

Sometimes a user may be able to "run" that an action exists but only against certain resources. you may use the `canRun` method in conjunction with the `canSee` method to have full control over authorization in this scenario. The callback passed to the `canRun` method receives the incoming HTTP request and the resource model:

```
new Publish().canRun((request, model) => model.getKey() % 2 === 0)
```

## Standalone Actions

Typically, actions are executed against resources selected on a resource index or detail API. However, sometimes you may have an action that does not require any resources / models to run. In these situations, you may register the action as a "standalone" action by invoking the `standalone` method when registering the action. These actions always receives an empty collection of models in their `handle` method:

```
/**
* Get the actions available on the entity.
*/
actions(request){
    return [
        new Publish().canRun(request => false)
    ];
}
```

# Error Handling

## Register Error Handler
The `handleErrorUsing` on the Avon allows you to register a cutom callback to handle errors:

```
Avon.handleErrorUsing((error) => console.error(error))
```