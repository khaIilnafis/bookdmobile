/**
 * Created by Jonfor on 12/31/15.
 */
module.exports = function (userFactory) {
  /**
   * Loops through all a businesses employees, makes a request to google to
   * retrieve the profile picture for users who authenticated with google+
   *
   * @param employeeArray - array of user objects
   * @param index
   */
  //function getGooglePlusPhotos(employeeArray, index) {
  //    if (index === employeeArray.length) {
  //        //done
  //    } else {
  //        for (var employeeIndex = index; employeeIndex < employeeArray.length - 1; employeeIndex++) {
  //            if (employeeArray[employeeIndex].provider === 'google_plus') {
  //                break;
  //            }
  //        }
  //        userFactory.getGooglePhoto(employeeArray[employeeIndex].providerId)
  //            .then(function (response) {
  //                if (!response.error) {
  //                    employeeArray[employeeIndex].photo = response.image.url.replace('sz=50', 'sz=200');
  //                } else {
  //                    console.log(response.error);
  //                }
  //
  //                getGooglePlusPhotos(employeeArray, employeeIndex + 1);
  //            });
  //    }
  //};
  function selectPhotos(businessArray) {
    _.forEach(businessArray, function (business) {
      business.photos = _.pullAt(business.photos, 0)
    });
    return businessArray;
  }

  function selectPhoto(business) {
    business.photos = _.pullAt(business.photos, 0);
    return business;
  };
  return {
    //getGooglePlusPhotos: getGooglePlusPhotos,
    selectPhotos: selectPhotos,
    selectPhoto: selectPhoto
  };
};
