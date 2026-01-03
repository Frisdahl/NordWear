export const processShippingOptions = (shippingOptions: any[]) => {
  const allOptions: any[] = [];
  shippingOptions.forEach((option: any) => {
    if (
      option.service_points &&
      option.service_points.length > 0
    ) {
      option.service_points.forEach((sp: any) => {
        allOptions.push({
          id: sp.id,
          name: `${option.carrier_name
            .replace(" (DK)", "")
            .replace(" Denmark", "")} - ${(
            sp.distance / 1000
          ).toFixed(2)}km - ${sp.name}`,
          address: sp.address,
          price: option.price,
          isServicePoint: true,
        });
      });
    } else {
      allOptions.push({
        id: option.id,
        name: option.name,
        address: "",
        price: option.price,
        isServicePoint: false,
        carrier_name: option.carrier_name,
      });
    }
  });

  const unwantedHomeDelivery = [
    "Return Drop Off",
    "Parcel",
    "Business Parcel",
  ];
  const homeDeliveryOptions = allOptions.filter(
    (option) =>
      !option.isServicePoint &&
      !unwantedHomeDelivery.some((unwanted) =>
        option.name.includes(unwanted)
      )
  );
  const servicePointOptions = allOptions.filter(
    (option) => option.isServicePoint
  );

  const postNordOptions = servicePointOptions.filter((option) =>
    option.name.startsWith("PostNord")
  );
  const glsOptions = servicePointOptions.filter((option) =>
    option.name.startsWith("GLS -")
  );

  const finalOptions = [
    ...postNordOptions.slice(0, 3),
    ...glsOptions.slice(0, 3),
    ...homeDeliveryOptions,
  ];
  
  return finalOptions;
};
