import pako from "pako";

const serialize = (data: any): string => {
  return JSON.stringify(data);
};
const deserialize = (data: string): any => {
  return JSON.parse(data);
};

export const compressData = (data: any): Uint8Array => {
  // Convert the data to a string format
  const serializedData = serialize(data);

  // Convert the serialized string to a Uint8Array
  const utf8Encoder = new TextEncoder();
  const dataArray = utf8Encoder.encode(serializedData);

  // Compress the data using pako
  const compressedData = pako.deflate(dataArray);

  return compressedData;
};

// Function to decompress data
export const decompressData = (compressedData: Uint8Array): any => {
  // Decompress the data using pako
  const decompressedDataArray = pako.inflate(compressedData);

  // Convert the decompressed Uint8Array back to a string
  const utf8Decoder = new TextDecoder();
  const serializedData = utf8Decoder.decode(decompressedDataArray);

  // Deserialize the data back to its original format
  const data = deserialize(serializedData);

  return data;
};
