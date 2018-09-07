import React from 'react';
import {render, hydrate} from 'react-dom';
import CoverStoryCard from './src/js/Container.jsx';

window.ProtoGraph = window.ProtoGraph || {};
window.ProtoGraph.Card = window.ProtoGraph.Card || {};

ProtoGraph.Card.toCoverStory = function () {
  this.cardType = 'toCoverStoryCard';
}

ProtoGraph.Card.toCoverStory.prototype.init = function (options) {
  this.options = options;
}

ProtoGraph.Card.toCoverStory.prototype.getData = function (data) {
  return this.containerInstance.exportData();
}

ProtoGraph.Card.toCoverStory.prototype.renderSection= function (data) {
  this.mode = 'section';
  this.render();
}

ProtoGraph.Card.toCoverStory.prototype.renderArticle= function (data) {
  this.mode = 'article';
  this.render();
}

ProtoGraph.Card.toCoverStory.prototype.render = function () {
  if (this.options.isFromSSR){
    hydrate(
      <CoverStoryCard
        selector={this.options.selector}
        mode={this.mode}
        dataURL={this.options.data_url}
        siteConfigs={this.options.site_configs}
        renderingSSR={true}
      />,
      this.options.selector);
  } else {
    render(
      <CoverStoryCard
        dataURL={this.options.data_url}
        selector={this.options.selector}
        domain={this.options.domain}
        siteConfigURL={this.options.site_config_url}
        siteConfigs={this.options.site_configs}
        clickCallback={this.options.onClickCallback}
        mode={this.mode}
        ref={(e) => {
          this.containerInstance = this.containerInstance || e;
        }} />,
      this.options.selector);
  }
}