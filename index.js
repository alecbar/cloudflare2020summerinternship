addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// To use with HTML rewriter
const pageVariantsContent = [
  {
    "title": "Alec on LinkedIn",
    "h1": "LinkedIn",
    "p": "View my experience and connect on LinkedIn!",
    "href": "https://www.linkedin.com/in/alec-barnard/",
    "a": "Connect with me!"
  },
  {
    "title": "Email Alec",
    "h1": "Email",
    "p": "Get in touch!",
    "href": "mailto:alecbarnard@live.com",
    "a": "Email me!"
  }
]

async function handleRequest(request) {

  let pageVariantIndex
  let isCookie 
  const cookieVariant = getPageVariantFromCookie(request.headers.get("Cookie"))

  if (cookieVariant){
    isCookie = true
    pageVariantIndex = cookieVariant
  }
  else{
    isCookie = false
    pageVariantIndex = getRandomPageVariant()
  }

  //Fetch array of page variants
  const pageVariants = await fetchPageVariants()
  
  // Page to send back
  const pageURL = pageVariants[pageVariantIndex]

  // HTML body to send in response
  const htmlPage = await fetchVariantHTML(pageURL)

  // Create and sent response
  const response = new Response(htmlPage)

  response.headers.set('Content-Type', "text/html")

  // Determine if cookies needs to be sent
  if(!isCookie){
    response.headers.set("Set-Cookie", "variant=" + pageVariantIndex + "; SameSite=Lax; HttpOnly;")
  }

  // Add variant specific content with rewriter
  return new HTMLRewriter()
  .on('title', new ContentRewriter(pageVariantsContent[pageVariantIndex]["title"]))
  .on('h1', new ContentRewriter(pageVariantsContent[pageVariantIndex]["h1"]))
  .on('p', new ContentRewriter(pageVariantsContent[pageVariantIndex]["p"]))
  .on('a', new ContentRewriter(pageVariantsContent[pageVariantIndex]["a"]))
  .on('a', new AttributeRewriter('href', pageVariantsContent[pageVariantIndex]["href"]))
  .transform(response)

}

// For modifying specific given attribute of given tag
class AttributeRewriter {
  constructor(attributeName, atributeValue) {
    this.attributeName = attributeName
    this.atributeValue = atributeValue
  }
  element(element) {
      element.setAttribute(this.attributeName, this.atributeValue)
  }
}

// For modifying innerHTML of given tag
class ContentRewriter {
  constructor(contentValue){
    this.contentValue = contentValue
  }
  element(element){
    element.setInnerContent(this.contentValue)
  }
}

// Check if page variant exists in cookies and returns value/index to use
function getPageVariantFromCookie(cookies) {

  let variant = null

  if (cookies) {
    cookies.split(";").forEach(cookie => {
      if (cookie.trim().split("=")[0] === "variant") {
        variant = cookie.trim().split("=")[1]
      }
    })
  }
  return variant
}

// Returns 0 or 1 randomly to use as index to select page variant
function getRandomPageVariant() {
  // Get random index of variants array 
  const randomVariant = Math.round(Math.random())

  // Page url
  return randomVariant
}

// Fetch list of page variants from API
async function fetchPageVariants() {
  const variants = await fetch("https://cfw-takehome.developers.workers.dev/api/variants")
    .then(response => response.json())
    .then(data => { return data["variants"] })

  return variants
}

// Fetch the actual HTML for the given page variant
async function fetchVariantHTML(pageVariant) {
  const html = await fetch(pageVariant)
    .then(response => { return response.body })

  return html
}