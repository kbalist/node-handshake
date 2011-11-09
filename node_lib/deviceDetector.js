/** Middleware for device identification */

var getInfos = function(ua){

        var $ = {},
            response = {
                isMobile : false,
                type : 'undefined'
            };

        if (/mobile/i.test(ua)){
//            $.Mobile = true;
            response.isMobile = true
        }

        if (/like Mac OS X/.test(ua)) {
            $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
            $.iPhone = /iPhone/.test(ua);
            $.iPad = /iPad/.test(ua);
            console.log( $.iOS );
            console.log( $.iPhone );
            console.log( $.iPad );
            response.isMobile = true;
            response.type = 'IOS';
        }

        if (/Android/.test(ua)){
            $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
            console.log($.Android);
            response.isMobile = true;
            response.type = 'android';
        }

        if (/webOS\//.test(ua)){
            $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];
            console.log( $.webOS );
            response.isMobile = true;
            response.type = 'webos';
        }

        if (/(Intel|PPC) Mac OS X/.test(ua)){
            $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;
            console.log( $.Mac );
            response.isMobile = false;
            response.type = 'mac';
        }


        if (/Windows NT/.test(ua)){
            $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
            console.log( $.Windows );
            response.isMobile = false;
            response.type = 'windows';
        }
        return response;
}
exports.getInfos = getInfos;