import {
  generateRecommendations
} from "./recommendation.service.js";

export const getRecommendations = async(req,res)=>{
  try{
    const user = req.user;

    const events = await req.services.eventService.getAllEvents();

    const rejectedFeedback = await req.services.recommendationsFeedbackServices.getRejectedEvents(user?.id);


    const rejectedEventIds = rejectedEventsIds = rejectedFeedback.map((feedback) => feedback.eventId);
    const recommendations = generateRecommendations({
      events,
      user,
      rejectedEventIds
  });

  return res.status(200).json({
    sucess : true,
    recommendations
  })

  }catch(error){
    console.error("Recommendation Error: ",error);

    return res.status(500).json({
      sucess : false,
      message: "Failed to generate recommendations"
    });
  }
};