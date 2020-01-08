import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {getStateNameByStateCode} from './helpers';
import './App.css';

const useStyles = makeStyles({
    card: {
      minWidth: 345,
      maxWidth: 345
    },
    media: {
        height: 250,
        paddingTop: '56.25%', // 16:9
    },
    title: {
      fontSize: 14,
    },
  });

  
  function Member({member}) {
    const classes = useStyles();

    // gets member's 
    // full name
    let name = member.name.official_full;
    // current term
    let currentTerm = member.terms[member.terms.length-1];
    // bioguide code, which returns the image
    let bioguide = member.id.bioguide;
    // gender
    let gender = member.bio.gender;

    // if image returns 404, one of these cat pics will be selected randomly to be used as the image
    let picsOnError = ['https://i.imgur.com/ar3PnQw.png', 'https://i.imgur.com/TSCW6ni.png', 'https://i.imgur.com/1kxeQar.png', 'https://i.imgur.com/EYGuCpn.png']

    function getRandomInt(max) {
        max = picsOnError.length;
        return Math.floor(Math.random() * Math.floor(max));
      }
      
    function handleImageError(ev) {
        // generic default profile pic
        // ev.target.src = '/default-profile-image.jpg';
        // select random cat profile pic
        ev.target.src = picsOnError[getRandomInt()];
    }

    return (
        <Card className={classes.card} variant="outlined">
            <CardHeader
                title={name}
                className='header'
            />
            <a 
                // link to a congressperson's wikipedia page
                // href={`https://en.wikipedia.org/wiki/${member.id.wikipedia.split(' ')[0]}_${member.id.wikipedia.split(' ')[1]}`} 
                // link to a congressperson's website
                href={currentTerm.url}
                target="_blank" 
                rel="noopener noreferrer"
            >
            <img 
                alt={name} 
                title={name}
                src={`https://theunitedstates.io/images/congress/225x275/${bioguide}.jpg`} 
                onError={handleImageError} 
                className='headshot'
            />
            </a>
            <CardContent>
                <Typography variant='h6' color="textSecondary" gutterBottom>
                    {currentTerm.type === 'sen' ? 'Senator' : 'Representative'} & {gender === 'M' ? 'Congressman' : 'Congresswoman'}
                </Typography>
                <Typography variant='h6' color="textSecondary" gutterBottom>
                    {currentTerm.party}{`${getStateNameByStateCode(currentTerm.state) ? `, ${getStateNameByStateCode(currentTerm.state)}` : ''}`}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Member;