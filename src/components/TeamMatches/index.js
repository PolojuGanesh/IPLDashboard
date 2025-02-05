// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }

    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  renderRecentMatchesList = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData

    return (
      <ul className="recent-matches-list">
        {recentMatches.map(recentMatch => (
          <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    )
  }

  renderPiechart = () => {
    let won = 0
    let lost = 0
    let drawn = 0

    const {teamMatchesData} = this.state
    const {latestMatch, recentMatches} = teamMatchesData

    if (latestMatch?.matchStatus === 'Won') {
      won += 1
    } else if (latestMatch?.matchStatus === 'Lost') {
      lost += 1
    } else if (latestMatch?.matchStatus === 'Drawn') {
      drawn += 1
    }

    recentMatches.forEach(each => {
      if (each.matchStatus === 'Won') {
        won += 1
      } else if (each.matchStatus === 'Lost') {
        lost += 1
      } else if (each.matchStatus === 'Drawn') {
        drawn += 1
      }
    })

    const pieData = [
      {name: 'Won', value: won},
      {name: 'Lost', value: lost},
      {name: 'Drawn', value: drawn},
    ]

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={pieData}
            startAngle={0}
            endAngle={360}
            innerRadius="40%"
            outerRadius="70%"
            dataKey="value"
          >
            <Cell name="Won" fill="#fecba6" />
            <Cell name="Lost" fill="#b3d23f" />
            <Cell name="Drawn" fill="#a44c9e" />
          </Pie>
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatch} = teamMatchesData

    return (
      <div className="responsive-container">
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        {this.renderPiechart()}
        {this.renderRecentMatchesList()}
        <div className="back-button-container">
          <Link className="link-for-back" to="/">
            <button className="back-button" type="button">
              Back
            </button>
          </Link>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches

// let won = 0
// let lost = 0
// let drawn = 0

// const {teamMatchesData} = this.state
// const {latestMatch, recentMatches} = teamMatchesData

// if (latestMatch?.matchStatus === 'Won') {
//   won += 1
// } else if (latestMatch?.matchStatus === 'Lost') {
//   lost += 1
// } else if (latestMatch?.matchStatus === 'Drawn') {
//   drawn += 1
// }

// recentMatches.forEach(each => {
//   if (each.matchStatus === 'Won') {
//     won += 1
//   } else if (each.matchStatus === 'Lost') {
//     lost += 1
//   } else if (each.matchStatus === 'Drawn') {
//     drawn += 1
//   }
// })

// const pieData = [
//   {name: 'Won', value: won},
//   {name: 'Lost', value: lost},
//   {name: 'Drawn', value: drawn},
// ]
