import Promise from 'bluebird';
import * as d3 from 'd3';
import * as _ from 'lodash';

export function loadData(isHitters) {
  return new Promise(function(resolve) {
    var file = isHitters ? 'hitters-data.csv' : 'pitchers-data.csv';
    d3.csv(file, function(data) {
      convertNumeric(data);
      var filtered = filter(data);
      resolve(filtered);
    });
  });
}

function convertNumeric(data) {
  _.forEach(data, function(d) {
    _.forEach(d, function(value, key) {
      if (_.includes(value, '%')) {
        value = value.replace(/\s*%/, '');
      }
      var parsed = _.toNumber(value);
      if (parsed || parsed === 0) {
        d[key] = parsed;
      }
    });
  });
}

function filter(data) {
  return _.filter(data, function(season) {
    return season.PA >= 500 || season.IP >= 150;
  });
}

function sortBySeason(data) {
  return _.sortBy(data, 'Season');
}

function groupByPlayer(data) {
  return _.groupBy(data, 'playerid');
}

// Return every numSeasons-sized block of consecutive seasons for the data
function playerSeasonChunks(data, numSeasons) {
  var sortedBySeason = sortBySeason(data);
  var byPlayer = groupByPlayer(sortedBySeason);
  var results = _.map(byPlayer, function(playerSeasons) {
    if (playerSeasons.length < numSeasons) {
      return [];
    }
    var chunkedSeasons = [];
    for (var i = 0; i <= playerSeasons.length - numSeasons; i++) {
      chunkedSeasons.push(playerSeasons.slice(i, i + numSeasons));
    }
    return chunkedSeasons;
  });
  return _.flatten(results);
}

function combineSeasons(chunkedSeasons) {
  return _.map(chunkedSeasons, function(seasonChunk) {
    // clone first season to be the one we return
    var summed = _.clone(seasonChunk[0]);
    // display-friendly seasons and teams
    summed.Seasons = _.map(seasonChunk, 'Season').join(', ');
    summed.Team = _.chain(seasonChunk)
      .map('Team')
      .uniq()
      .without('- - -')
      .value()
      .join(', ');
    // average for each fields
    _.forEach(summed, function(value, stat) {
      if (_.isNumber(value)) {
        summed[stat] = _.round(_.mean(_.map(seasonChunk, stat)), 3);
      }
    });
    return summed;
  });
}

export function bestPeriodPerPlayer(seasons, numSeasons, field, ascending) {
  var chunked = playerSeasonChunks(seasons, numSeasons);
  var combined = combineSeasons(chunked);
  var grouped = groupByPlayer(combined);

  var bestFunc = ascending ? _.maxBy : _.minBy;
  var results = _.map(grouped, function(playerSeasons) {
    return bestFunc(playerSeasons, field);
  });
  return sortByStat(results, field, ascending);
}

function sortByStat(seasons, stat, ascending) {
  var sorted = _.sortBy(seasons, stat);
  if (ascending) {
    return _.reverse(sorted);
  }
  return sorted;
}
