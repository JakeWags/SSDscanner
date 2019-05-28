'use strict';
 
const result = require('dotenv').config(); if (result.error) throw result.error;

const Snoowrap = require("snoowrap");
const fs = require('fs');

const r = new Snoowrap({
	userAgent: process.env.SCRIPT_USERAGENT,
  	clientId: process.env.SCRIPT_CLIENTID,
  	clientSecret: process.env.SCRIPT_CLIENTSECRET,
  	username: process.env.SCRIPT_USERNAME,
  	password: process.env.SCRIPT_PASSWORD
});

/**
 * Parses through posts passed through for title parameters
 * @param  {object} posts Object containing list of posts retrieved
 * @return {null}
 */
function parsePosts(posts) {
	for (let i = 0; i < posts.length; i++) {
		if (posts[i].title.includes("2.5") && posts[i].title.includes("SSD")) {
			appendPost({
				title: posts[i].title,
				link: "reddit.com" + posts[i].permalink,
			});
		}
	}
}

/**
 * Append a post to text file
 * @param  {object} post Post to append with title and link
 * @return {null}
 */
function appendPost(post) {
	let data = `\n\nTitle: ${post.title}\nLink: ${post.link}`;
		fs.appendFile('PostList.txt', data, (err) => {
			if (err) throw err;
		});
	}
	

/**
 * Initializes the text file and fetches 100 most recent posts from /r/buildapcsales
 * @return {null}
 */
function init() {
	r.getSubreddit('buildapcsales').getNew({limit:100}).then(function(json) {
		parsePosts(json);
	});

	fs.writeFile('PostList.txt', `${new Date().toLocaleDateString()}'s 2.5 Inch SSD Sales on /r/buildapcsales:`, (err) => {
		if (err) throw err;
	});
}

init();