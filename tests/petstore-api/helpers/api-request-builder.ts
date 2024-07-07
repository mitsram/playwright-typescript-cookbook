
class ApiRequestBuilder {
    method: string;
    url: string;
    headers: {};
    queryParams: {};
    body: null;
    
    constructor() {
      this.method = 'GET';
      this.url = '';
      this.headers = {};
      this.queryParams = {};
      this.body = null;
    }
  
    setMethod(method) {
      this.method = method;
      return this;
    }
  
    setUrl(url) {
      this.url = url;
      return this;
    }
  
    addHeader(key, value) {
      this.headers[key] = value;
      return this;
    }
  
    addQueryParam(key, value) {
      this.queryParams[key] = value;
      return this;
    }
  
    setBody(body) {
      this.body = body;
      return this;
    }
  
    build() {
      let queryString = Object.keys(this.queryParams).map(key => `${key}=${this.queryParams[key]}`).join('&');
      let finalUrl = this.url;
      if (queryString) {
        finalUrl += `?${queryString}`;
      }
  
      return {
        method: this.method,
        url: finalUrl,
        headers: this.headers,
        data: this.body,
      };
    }
  }
  