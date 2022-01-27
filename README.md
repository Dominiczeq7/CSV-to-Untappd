# CSV-to-Untappd

Thanks this app you can import data (do check-ins) to Untappd. It works only by facebook login to avoid captcha.
You must have a CSV file with columns:
- "Piwo" - beer name
- "Browar" - brewery name
- "Moja ocena" - your rating
- "Średnia ocena" - another rating (is optional - for my private using)

## Run steps:
1. Clone repo
2. Move your csv file to "beer_data" folder
3. Copy file "cypress.env.example.json" and change name to "cypress.env.json"
4. Fill new file by typing your fb credential and your CSV file
5. Run command "npm install"
6. Run command "npx cypress open"
7. Run "check-in.spec.ts" test by click on it
8. Wait for tests run out
