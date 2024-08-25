import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {

    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta
                    name='description'
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail 
                image={props.meetupData.image} 
                title={props.meetupData.title} 
                address={props.meetupData.address} 
                description={props.meetupData.description}
            />
        </Fragment>
    );
}

export async function getStaticPaths() {

    // fetch data for a single meetup
    const client = await MongoClient.connect('mongodb+srv://Anara5:Anara5@cluster0.n6866.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();
    client.close();

    return {
        fallback: false,
        paths: meetups.map(meetup => ({
            params: { meetupId: meetup._id.toString() }
        }))
    };
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;
    
    // fetch data for a single meetup
    const client = await MongoClient.connect('mongodb+srv://Anara5:Anara5@cluster0.n6866.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({
        _id: new ObjectId(meetupId)
    });
    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description
            }
        }
    };
}

export default MeetupDetails;