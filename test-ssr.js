var SSR = require('./dist/0.0.1/ssr-card.min.js')
var state = {
    "dataJSON": { "data": { "url": "https://dnt71st2q6cqr.cloudfront.net/stories/note-a-sample-story-195.html", "headline": "Note: A Sample Story", "byline": "Amit Badheka", "publishedat": "2018-03-19T08:01:00", "hide_byline": false, "series": "Test", "genre": "Entertainment", "subgenre": "Sports", "iconbgcolor": "white", "imageurl": "https://dnt71st2q6cqr.cloudfront.net/images/pyktest/ae0e4eae9fde7556/5881.jpeg", "col7imageurl": "https://dnt71st2q6cqr.cloudfront.net/images/pyktest/ae0e4eae9fde7556/5881-16c.jpeg", "focus": "h", "country": "India", "state": "", "city": "", "faviconurl": "https://dnt71st2q6cqr.cloudfront.net/images/pyktest/f932bec7afc53494/5869-thumb.png", "importance": "low", "summary": "Summary, the minimum length is 50 characters, but i was using 45 chars." } }
}
let x = SSR.render(state, "section");
console.log(x);