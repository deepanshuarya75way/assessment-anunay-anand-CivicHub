import { useState } from "react"

const RecommendationCard = ({recommendation,onDismiss})=>{
  const [submitting, setSubmitting]= useState(false);

  const {event,reason} = recommendation;

  const handleNotRelevan = async () =>{
   try{
    console.log("Done");
   }catch(err){
    cosnole.error(err);
   }
  }
}