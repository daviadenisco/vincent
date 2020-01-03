import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import stateList from './states';
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

let getStateNameByStateCode = function(code) {
    for (let key in stateList) {
        if (code === key) {
            return stateList[key]
        }
    }
};

function Member({member}) {
    const classes = useStyles();

    return (
        <Card className={classes.card} variant="outlined">
            <CardHeader
                title={member.name.official_full}
                className='header'
            />
            <CardMedia
                className={classes.media}
                image={`https://theunitedstates.io/images/congress/225x275/${member.id.bioguide}.jpg`}
                title="IMAGE OF POLITICIAN"
            />
            <CardContent>
                <Typography variant='h6' color="textSecondary" gutterBottom>
                    {member.terms[member.terms.length-1].type === 'sen' ? 'Senator' : 'Representative'} & {member.bio.gender === 'M' ? 'Congressman' : 'Congresswoman'}
                </Typography>
                <Typography variant='h6' color="textSecondary" gutterBottom>
                    {member.terms[member.terms.length-1].party}, {getStateNameByStateCode(member.terms[member.terms.length-1].state)}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Member;