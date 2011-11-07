/** Middleware for device identification */

var isMobile = function(ua){

        var $ = {},
            mobileVersion = false;

        if (/mobile/i.test(ua)){
//            $.Mobile = true;
            mobileVersion = true
        }

        if (/like Mac OS X/.test(ua)) {
            $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
            $.iPhone = /iPhone/.test(ua);
            $.iPad = /iPad/.test(ua);
            console.log( $.iOS );
            console.log( $.iPhone );
            console.log( $.iPad );
            mobileVersion = true;
        }

        if (/Android/.test(ua)){
            $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
            console.log($.Android);
            mobileVersion = true;
        }

        if (/webOS\//.test(ua)){
            $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];
            console.log( $.webOS );
            mobileVersion = true;
        }

        if (/(Intel|PPC) Mac OS X/.test(ua)){
            $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;
            console.log( $.Mac );
            mobileVersion = false;
        }


        if (/Windows NT/.test(ua)){
            $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
            console.log( $.Windows );
            mobileVersion = false;
        }
        return mobileVersion;
}
exports.isMobile = isMobile;