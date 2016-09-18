/* The CinemaDAOContentHandler */
module.exports = CinemaContentHandler;

function CinemaContentHandler (db) {
    "use strict";
	var cinemaDAO = new CinemaDAO(db);
	
	this.getCinema = function(req,res,next){
	     var id = req.params.id;
	     cinemaDAO.getCinema(id,function(err,details){	    
		 if ( err ) 
			 throw next(err);
		 res.json( details );
	  });
	}
}