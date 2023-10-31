const front_dev_urls=["http://localhost:3000","http://localhost:3001","http://localhost:3002","http://localhost:3003"]
const front_prod_url=["https://gestionnaire-contacts-nextjs-2-iyi1.vercel.app",]
const front_url=["https://gestionnaire-contacts-nextjs-2.vercel.app","http://localhost:3000","http://localhost:3001"]
module.exports = {
    front_url: front_url//process.env.NODE_ENV === "production" ? front_prod_url : front_dev_urls
  };
