package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._

object Application extends Controller {
  
  def index = Action {implicit request =>
    Ok(views.html.index("Your new WebSocket Demo application is ready.")).withSession(
        ("uuid" -> java.util.UUID.randomUUID.toString)
      )
  }
  
  def ws = 
    WebSocket.async[JsValue] {implicit request => 
	  actors.ws.ExampleWs.control
  }
  
  def testBroadCast = Action {
    import actors.ws.ExampleWs
    import actors.ws.ExampleWs._
    ExampleWs.actor ! AlertForSomething
    Ok("Msg2 Sent")
  }
}