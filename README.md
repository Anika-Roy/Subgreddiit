# DASS ASSIGNMENT 1
# ANIKA ROY - 2021113008
## File structure
```
2021113008/
|--server/
	|--package.json
	|--package-lock.json
	|--Dockerfile
	|--Makefile
	... other files
|--frontend
	|--package.json
	|--package-lock.json
	|--Dockerfile
	|--Makefile
	... other files
|--README.md
|--docker-compose.yml
|--Makefile
```
## Assumptions
- There is no error handling for edge cases not explicitly mentioned in the pdf, like clicking a button multiple times or blocking yourself etc
- clicking on an upvote button twice leads to the post getting un-upvoted, similarly for downvote
- comments do not include the user that commented (since not required in the pdf)
- Sorting and filtering- the assumption that joined subgreddiits are shown before not joined subgreddiits is always upheld even when filters/sorts/ searches are applied.
- when the same post is reported multiple times and if in one report, it is ignored and in the other it is deleted, the post gets deleted from the subgreddiit but not from the database so the ignored report is still displayed
- blocked users in the mysubgreddiit->users page are shown **bold**
- after making changing, most pages need to be refreshed for reflecting those changes

## Commands to run app
### With docker
```
cd 2021113008/server
sudo make build
cd ..
cd client/
sudo make build
cd ..
sudo make run-dev
```
Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.
### Without docker
You could use `npm start` after cd into client folder and `nodemon server` or `node server` after cd into server folder.
The webapp would be running on post 3000

## Github repo link
https://github.com/Anika-Roy/DASS_A_1
(will make public if asked)

