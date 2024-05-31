# Northcoders News API

This node express API is to create, read, update and delete articles, and their comments, check the users who wrote, as well as find how many comments there are per article.

This API can be found hosted on the next link https://be-nc-news-hv67.onrender.com where you can play around with the different endpoints.

# Run NC-news locally

### 1- Clone the repository from GitHub, install node packages

```
// on your local terminal
git clone https://github.com/rociosmm/be-nc-news.git
cd bc-nc-news
npm install
```

### 2- Create env files with the database info and create and seed them.

To run this repo locally, you will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment. Double-check that these .env files are .gitignored

After, you need to create and seed your local databases with the data provided. Run the next script:

```
npm run setup-dbs
npm run seed
```

### 3- Run tests

After everything is set up, you can run the tests to ensure everything is running as it is meant. Run the next script:

```
npm run app
```

### 4- Play around with the endpoints of the API.

On the `http://localhost:9090/api/` endpoint there is a list with all the endpoints and their description.
Open your local browser and verify the be-nc-news is working by accessing:  
`http://localhost:9090/api/`  
`http://localhost:9090/api/articles`  
`http://localhost:9090/api/users`

### 5- Minimum versions

**Node.js**: 22.2.0 <br>
**Postgres**: 14.11

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
