import React from 'react';
import axios from 'axios';
import ta from 'time-ago';
export default class toCoverStoryCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {
        card_data: {},
        configs: {}
      },
      domain: undefined,
      optionalConfigJSON: {},
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.card_data.data.language);
    }

    if (this.props.optionalConfigJSON) {
      stateVar.optionalConfigJSON = this.props.optionalConfigJSON;
    }

    if(this.props.domain){
      stateVar.domain = this.props.domain;
    }

    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
  }

  componentDidMount() {
    if (this.state.fetchingData){
      let items_to_fetch = [
        axios.get(this.props.dataURL)
      ];
      if (this.props.siteConfigURL) {
        items_to_fetch.push(axios.get(this.props.siteConfigURL));
      }
      axios.all(items_to_fetch).then(axios.spread((card, site_configs) => {
        let stateVar = {
          fetchingData: false,
          dataJSON: {
            card_data: card.data
          },
          optionalConfigJSON: {}
        };
        site_configs ? stateVar["siteConfigs"] = site_configs.data : stateVar["siteConfigs"] =  this.state.siteConfigs;

        stateVar.optionalConfigJSON.house_colour = stateVar.siteConfigs.house_colour;
        stateVar.optionalConfigJSON.reverse_house_colour = stateVar.siteConfigs.reverse_house_colour;
        stateVar.optionalConfigJSON.font_colour = stateVar.siteConfigs.font_colour;
        stateVar.optionalConfigJSON.reverse_font_colour = stateVar.siteConfigs.reverse_font_colour;
        stateVar.optionalConfigJSON.story_card_style = stateVar.siteConfigs.story_card_style;
        stateVar.optionalConfigJSON.story_card_flip = stateVar.siteConfigs.story_card_flip;
        stateVar.languageTexts = this.getLanguageTexts(stateVar.siteConfigs.primary_language.toLowerCase());
        this.setState(stateVar);
      }));
    } else {
      this.componentDidUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
    }
  }

  componentDidUpdate() {
    if(this.state.optionalConfigJSON.story_card_flip && this.state.dataJSON.card_data.data.summary){
      let elem = document.querySelector('.protograph-summary-text');
      this.multiLineTruncate(elem);
    }
  }

  multiLineTruncate(el) {
    let data = this.state.dataJSON.card_data.data,
      wordArray = data.summary.split(' '),
      props = this.props;
    if (el) {
      while(el.scrollHeight > el.offsetHeight) {
        wordArray.pop();
        el.innerHTML = wordArray.join(' ') + '...' + '<br><a id="read-more-button" href="#" class="protograph-read-more">Read more</a>' ;
      }
    }
  }

  exportData() {
    return this.props.selector.getBoundingClientRect();
  }

  checkURL(url){
    var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (!re.test(url)) {
        return false;
    }
    return true;
  }

  // calculateDateTime() {
  //   const data = this.state.dataJSON.card_data;
  //   let date_split, date_split_by_hyphen, new_date, month, time;
  //     date_split = data.data.date.split("T")[0],
  //     date_split_by_hyphen = date_split.split("-"),
  //     new_date = new Date(date_split),
  //     month = new_date.toLocaleString("en-us", { month: "short" }),
  //     time = data.data.date.split("T")[1];
  //   let is_am_pm_split = time.split(":"), am_pm;
  //   if (is_am_pm_split[0] < "12"){
  //     am_pm = "am"
  //   } else {
  //     am_pm = "pm"
  //   }

  //   return {
  //     month: month,
  //     am_pm: am_pm,
  //     date: date_split_by_hyphen,
  //     time: time
  //   }
  // }

  ellipsizeTextBox() {
    let container = document.querySelector('.article-title'),
    text = document.querySelector('.article-title'),
      // text = document.querySelector(`.protograph-${this.props.mode}-mode .protograph-tocluster-title`),
      wordArray;
    let headline = this.state.dataJSON.card_data.data.headline;
    if(headline === '' || headline === undefined){
      text.innerHTML='';
    }else{
      // Setting the string to work with edit mode.
      text.innerHTML = this.state.dataJSON.card_data.data.headline;
      wordArray = this.state.dataJSON.card_data.data.headline.split(' ');
      while (container.offsetHeight > 80) {
        wordArray.pop();
        text.innerHTML = wordArray.join(' ') + '...';
      }
    }
  }

  handleClick(){
    window.open(this.state.dataJSON.card_data.data.url,'_top');
  }

  // matchDomain(domain, url) {
  //   let url_domain = this.getDomainFromURL(url).replace(/^(https?:\/\/)?(www\.)?/, ''),
  //     domain_has_subdomain = this.subDomain(domain),
  //     url_has_subdomain = this.subDomain(url_domain);

  //   if (domain_has_subdomain) {
  //     return (domain === url_domain) || (domain.indexOf(url_domain) >= 0);
  //   }
  //   if (url_has_subdomain) {
  //     return (domain === url_domain) || (url_domain.indexOf(domain) >= 0);
  //   }
  //   return (domain === url_domain)
  // }

  // getDomainFromURL(url) {
  //   let a = document.createElement('a');
  //   a.href = url;
  //   return a.hostname;
  // }

  // subDomain(url) {
  //   if(!url){
  //     url = "";
  //   }
  //   // IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
  //   url = url.replace(new RegExp(/^\s+/), ""); // START
  //   url = url.replace(new RegExp(/\s+$/), ""); // END

  //   // IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
  //   url = url.replace(new RegExp(/\\/g), "/");

  //   // IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
  //   url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i), "");

  //   // IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
  //   url = url.replace(new RegExp(/^www\./i), "");

  //   // REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
  //   url = url.replace(new RegExp(/\/(.*)/), "");

  //   // REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
  //   if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
  //     url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i), "");

  //     // REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
  //   } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
  //     url = url.replace(new RegExp(/\.[a-z]{2,4}$/i), "");
  //   }

  //   // CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
  //   var subDomain = (url.match(new RegExp(/\./g))) ? true : false;

  //   return (subDomain);
  // }

  renderHTML(data) {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      return (
      <div className="pro-container" onClick={() => { this.handleClick() }}>
        <div className="pro-col pro-col-16">
          <div className="pro-row pro-row-5">
            <div className="pro-card pro-cover-card">
              <div className="frost-glass-background">
                <img src={data.imageurl}></img>
                <div className="black-overlay"></div>
              </div>
              <div className="toCoverStory-cover-image">
                <img src={data.imageurl}></img>
              </div>
              <div className="context">
                <div className="intersection-tag">
                  {data.genre && <span>{data.genre}</span>}
                  {data.genre && data.subgenre && <span>&#x2027;</span>}
                  {data.subgenre && <span>{data.subgenre}</span>}
                </div>
                {data.headline && <h1>{data.headline}</h1>}
                {data.summary && <p>{data.summary}</p>}
                <div className="publishing-info">
                  {!data.hide_byline && <div className="byline">
                    <div className="byline-image"><img src={data.byline_image}></img></div>
                    <div className="byline-name">{data.byline}</div>
                    {data.publishedat && <div className="timeline"><span className="dot-seperator">&#x2027;</span>{ta.ago(data.publishedat)}</div> }
                  </div>}
                  <div className="media-icons">
                    <span><img src="https://s3.ap-south-1.amazonaws.com/dev.cdn.protograph/lib/image.png" height="8px"></img></span>
                    <span className="dot-seperator">&#x2027;</span>
                    <span><img src="https://s3.ap-south-1.amazonaws.com/dev.cdn.protograph/lib/audio.png" height="8px"></img></span>
                    <span className="dot-seperator">&#x2027;</span>
                    <span><img src="https://s3.ap-south-1.amazonaws.com/dev.cdn.protograph/lib/video.png" height="8px"></img></span>
                  </div>
                  {(data.city || data.state || data.country) && <div className="location-details">
                    <img src="https://s3.ap-south-1.amazonaws.com/dev.cdn.protograph/lib/location-icon.png"></img>
                      <span>{data.city ? data.city + (data.state || data.country ? ", " : "") : ""}
                      {data.state ? data.state + ( data.country ? ", " : "" ):""}
                      {data.country}</span>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    }
  }

  renderSection(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      let data = this.state.dataJSON.card_data.data;
      return(
        <div className="pro-section-page">
          {this.renderHTML(data)}
        </div>
      )
    }
  }

  renderArticle(){
    if(this.state.fetchingData){
      return(
        <div>Loading</div>
      )
    }else{
      let data = this.state.dataJSON.card_data.data;
      return(
        <div className="pro-article-page">
          {this.renderHTML(data)}
        </div>
      )
    }
  }

  getLanguageTexts(languageConfig) {
    let language = languageConfig ? languageConfig : "hindi",
      text_obj;

    switch(language.toLowerCase()) {
      case "hindi":
        text_obj = {
          font: "'Sarala', sans-serif"
        }
        break;
      default:
        text_obj = {
          font: undefined
        }
        break;
    }
    return text_obj;
  }

  render() {
    switch(this.props.mode) {
      case 'section':
        return this.renderSection();
      case 'article':
        return this.renderArticle();
      default:
        return this.renderHTML(this.state.dataJSON.data);
    }
  }
}