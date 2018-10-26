import React from 'react';
import axios from 'axios';
import ta from 'time-ago';
export default class toCoverStoryCard extends React.Component {
  constructor(props) {
    super(props)
    let stateVar = {
      fetchingData: true,
      dataJSON: {},
      domain: undefined
    };

    if (this.props.dataJSON) {
      stateVar.fetchingData = false;
      stateVar.dataJSON = this.props.dataJSON;
      stateVar.languageTexts = this.getLanguageTexts(this.props.dataJSON.data.language);
    }

    if(this.props.domain){
      stateVar.domain = this.props.domain;
    }

    if (this.props.siteConfigs) {
      stateVar.siteConfigs = this.props.siteConfigs;
    }

    this.state = stateVar;
    this.handleClick = this.handleClick.bind(this);
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
          dataJSON: card.data,
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
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataJSON) {
      this.setState({
        dataJSON: nextProps.dataJSON
      });
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

  handleClick(){
    window.open(this.state.dataJSON.data.url,'_top');
  }

  renderHTML(data) {
    if (this.state.fetchingData) {
      return (
        <div></div>
      )
    } else {
      let publish_info_classname = 'publishing-info-blank';
      if((!data.hide_byline && data.byline)) {
        publish_info_classname = 'publishing-info';
      }
      return (
        <div className="pro-card pro-cover-card" onClick={() => { this.handleClick() }}>
          <div className="frost-glass-background">
            <img src={data.imageurl}></img>
            <div className="black-overlay"></div>
          </div>
          <div className="toCoverStory-cover-image">
            <img src={data.imageurl}></img>
          </div>
          <div className="context-cover-story">
            <div className="intersection-tag">
              {data.genre && <span>{data.genre}</span>}
              {data.genre && data.subgenre && <span>&#x2027;</span>}
              {data.subgenre && <span>{data.subgenre}</span>}
            </div>
            {data.headline && <h1>{data.headline}</h1>}
            {data.summary && <p>{data.summary}</p>}
            <div className={publish_info_classname}>
              {!data.hide_byline && <div className="byline">
                {data.byline_image && <div className="byline-image"><img src={data.byline_image}></img></div>}
                <div className="byline-name">{data.byline}</div>
                {data.publishedat && <div className="timeline"><span className="dot-seperator">&#x2027;</span>{ta.ago(data.publishedat)}</div> }
              </div>}
              {(data.hasvideo || data.hasimage || data.hasaudio) && <div className="media-icons">
                {data.hasimage && <span><img src="https://cdn.protograph.pykih.com/Assets/image.png" height="8px"></img>
                    {(data.hasaudio || data.hasvideo) && <span className="dot-seperator">&#x2027;</span>}</span>}
                {data.hasaudio && <span><img src="https://cdn.protograph.pykih.com/Assets/audio.png" height="8px"></img>
                    {data.hasvideo && <span className="dot-seperator">&#x2027;</span>}</span>}
                {data.hasvideo && <span><img src="https://cdn.protograph.pykih.com/Assets/video.png" height="8px"></img></span>}
              </div>}
              {(data.city || data.state || data.country) && <div className="location-details">
                <img src="https://cdn.protograph.pykih.com/lib/location-icon.png"></img>
                  <span>{data.city ? data.city + (data.state || data.country ? ", " : "") : ""}
                  {data.state ? data.state + ( data.country ? ", " : "" ):""}
                  {data.country}</span>
              </div>}
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
      let data = this.state.dataJSON.data;
      return(
        <div className="pro-section-page">
          <div className="pro-container" onClick={() => { this.handleClick() }}>
            <div className="pro-col pro-col-16 cover-story-card">
              <div className="pro-row pro-row-5">
              {this.renderHTML(data)}
              </div>
            </div>
          </div>
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
      let data = this.state.dataJSON.data;
      return(
        <div className="pro-article-page">
          <div className="pro-container" onClick={() => { this.handleClick() }}>
            <div className="pro-col pro-col-16 cover-story-card">
              <div className="pro-row pro-row-5">
              {this.renderHTML(data)}
              </div>
            </div>
          </div>
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