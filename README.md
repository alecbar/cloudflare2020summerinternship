# Cloudflare Workers Internship Application: Full-Stack
This is my submission for the Cloudflare 2020 Summer Internship. 

## What is it?
This application is hosted on [Cloudflare Workers](https://workers.cloudflare.com) and randomly sends user one of two pages, A/B testing style. 

## How does it work?
- Uses `fetch()` to get the page variants from `https://cfw-takehome.developers.workers.dev/api/variants`
- Randomly selects which link variant to use and uses `fetch()` again to get the HTML page source
- Serves the HTML page in the response

## Extra features
- Checks for cookie to determine if user has visited before in order to serve the same page, if not serves random page and sends back cookie for future use
- Uses [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/) to modify HTML page source before sending
- Hosted on custom domain [alecbarnard.io](http://alecbarnard.io) through Cloudflare

## Try it 
Try it out for yourself at [internship.alecbarnard.workers.dev](https://internship.alecbarnard.workers.dev) or [alecbarnard.io](http://alecbarnard.io).

Use [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/storage/cookies) to inspect and clear cookies to see if you get a different page version.

## More information
View the original prompt and instructions [here](PROMPT.md).
