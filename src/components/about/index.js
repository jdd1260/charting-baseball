import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    'max-height': '80vh',
    'overflow-y': 'scroll'
  },
  div: {
    'margin-top': 15,
    'text-align': 'center'
  },
  text: {
    'margin-top': 10
  }
});

class About extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={ classes.div }>
        <Button
          onClick={this.handleOpen}
          variant="contained"
          color="primary"
        >
          About The Visualization
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={ getModalStyle() } className={ classes.paper }>
            <Typography variant="title" id="modal-title">
              About The Visualization
            </Typography>
            <Typography variant="subheading" id="simple-modal-description" className={ classes.text }>
              <p>
                This data visualization allows the user to explore data from Major League baseball in order to answer the question "Who is the Best Baseball Player?" It attempts to answer that question by looking at players (both hitters and pitchers) as they performed during their best seasons using a variety of statistics. By looking at player performance across multiple seasons we can attempt to answer this question using a balance of a player's peak performance as well as for longer periods of time. The visualization follows a martini glass structure where the first four scenes are author driven and attempt to apply a standard approach to answering the question while the fifth season allows the user to customize the parameters.
              </p>
              <p>
                For scenes 1-4 the focus is on the statistic WAR (Wins Above Replacement), which allows us to use a single statistic that can assess the value of both hitters and pitchers (there are very few statistics that can apply to both). The visualization then uses a shorter (5 years) and longer (15 years) term span to see which players performed the best over each term. By following the same approach across scenes we are able to identify the best hitter and pitcher based on the WAR statistic. However, a user may want to assess players with a different statistic. Thus, in scene five they are given full control of the parameters and can change the season span, statistic, and player type. Each of these five scenes follow a consistent template for their scatter plot, allowing the user to move through the seasons with quick comprehension and without jarring transitions.
              </p>
              <p>
                The top pitcher and hitter from scenes 1-4 (Barry Bonds and Randy Johnson) are consistently annotated, even in scene five. This annotation is the same as the tooltip that you can see by hovering over any data point. It displays the player's name, teams, what seasons are being represented, the value of the statistic being ranked on, average age during the period, and the percentil that they fall into based. By persisting these annotations in scene five we allow the user to easily see how the best players from scenes 1-4 perform based on the user's customized parameter selections.
              </p>
              <p>
                This visualization is controlled by three parameters, each of which is pre-determined for scenes 1-4 but controlled by the user in scene five. The parameters are:
                <ol>
                  <li>
                    Season Span: the span of seasons that you want to look at performances for. For example, if this value is "5" then you are displaying data for the best 5 season span for each player. This looks at the best 5 full seasons, disregarding any incomplete season data.
                  </li>
                  <li>
                    Statistic: baseball players can be assessed on many statistics, such as ERA (Earned Run Average), HR (Home runs hit), or AVG (Batting Average). The selected statistic is used to determine player rankings. The determination of what is each player's best season span is made using this statistic, with the displayed value being an average across that span. You can find a reference for all of the statistics used here on FanGraphs: <a href="https://www.fangraphs.com/library/offense/offensive-statistics-list">Hitters</a> and <a href="https://www.fangraphs.com/library/pitching/complete-list-pitching">Pitchers</a> can be found separately.
                  </li>
                  <li>
                    Player Type: Hitters and Pitchers are assessed using very different statistics and cannot be ranked together. This selection controls which type of players are ranked, as well as controlling what statistic choices are applicable.
                  </li>
                </ol>
              </p>
              <p>
                The user gains full control of the parameters in scene five, but the trigger methods were selected so that the user cannot set invalid parameters. There is a slider that can be used to control the season span, with a minimum of 1 and a maximum of 22, representing the shortest span we consider as well as the longest in our data set. The statistic and player type can be selected from a drop down list. Based on the player type selected the statistic drop down will only present applicable options. Each of these inputs are disabled in scenes 1-4, but visible in order to show how they work. The user may also mouse over a data point in order to see the tooltip data (as described earlier). This is communicated to them by the annotations that look and are positioned in the same manner.
              </p>
              <p>
                Based on the parameters for each scene, all players in the data set are ranked on the average value of the selected statistic across their best period of years represented by the selected season span. If a player did not play enough full seasons to meet the selected season span then they do not appear on the chart. Thus, few players appear when the season span is 15, because players do not typically have careers of that length. The players are then displayed in a scatter plot where the x-axis plots their ranking (represented as Percentile so that better performing players are on the right as is more natural) while the average value of their statistic is the y-axis. This allows the user to see the raw statistic data for each player, but also how much better players of different calibers perform. For example, in scene 3 you can easily see that the difference in WAR between the top ranked pitcher (Randy Johnson) and the second ranked (Pedro Martinez) is similar to the difference between a pitcher in the 40th and 70th percentiles. It allows the user to quickly comprehend the meaning in the rankings: Randy Johnson was immensely superior to other pitchers.
              </p>
              <p>
                Each player's data point is also color-coded to represent their average age during the span. This allows you to see if players perform better when they are younger or older. It also allows you to see data points like that of Mike Trout, who is currently still playing but near the top of the 5 year hitters WAR chart despite his young average age of 22. Since he is still young compared to the other top hitters you could imagine that he improves as he ages and achieves an even higher ranking.
              </p>
              <p>
                All data is for players since 1968. Data was retrieved from <a href="https://www.fangraphs.com/">FanGraphs</a> and exported to a csv. Data was limited to players with 500 plate appearences or 150 innings pitched in order to have full seasons represented in our averages.
              </p>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
