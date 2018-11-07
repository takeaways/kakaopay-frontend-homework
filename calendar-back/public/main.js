(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("app.config.ts", function(exports, require, module) {
"use strict";
exports.config = {
    serverUrl: 'http://localhost:3000/calendarServer',
    templateBucketUrl: 'http://templates.calendarServer.com',
    appBucketUrl: 'http://apps.calendarServer.com',
    modalTheme: 'flat-attack',
};
//# sourceMappingURL=app.config.js.map
});

require.register("app.module.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var app_routes_1 = require("./app.routes");
var http_1 = require("@angular/http");
var material_1 = require("@angular/material");
var app_component_1 = require("./components/app/app.component");
var stat_service_1 = require("./services/stat.service");
var mock_data_service_1 = require("./services/mock-data.service");
var area_chart_component_1 = require("./directives/area-chart/area-chart.component");
var line_graph_component_1 = require("./directives/line-graph/line-graph.component");
var angular2_data_table_1 = require("angular2-data-table");
var modal_service_1 = require("./services/modal.service");
var vex_module_1 = require("./lib/vex/vex.module");
var angular2_modal_1 = require("angular2-modal");
var previewer_component_1 = require("./components/previewer/previewer.component");
var file_upload_module_1 = require("./lib/ng2-file-upload/components/file-upload/file-upload.module");
var template_service_1 = require("./services/template.service");
var user_service_1 = require("./services/user.service");
var auth_service_1 = require("./services/auth.service");
var material_example_component_1 = require("./components/material-example/material-example.component");
var features_component_1 = require("./components/features/features.component");
var login_component_1 = require("./components/login/login.component");
var pricing_component_1 = require("./components/pricing/pricing.component");
var platform_component_1 = require("./components/platform/platform.component");
var support_component_1 = require("./components/support/support.component");
var templates_component_1 = require("./components/templates/templates.component");
var start_component_1 = require("./components/start/start.component");
var preload_image_1 = require("./components/preload-image/preload-image");
var pager_component_1 = require("./shared/pager.component");
var ng2_page_scroll_module_1 = require("./lib/ng2-page-scroll/ng2-page-scroll.module");
var template_detail_component_1 = require("./components/template-detail/template-detail.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                app_routes_1.routing,
                http_1.HttpModule,
                material_1.MaterialRootModule,
                angular2_data_table_1.Angular2DataTableModule,
                angular2_modal_1.ModalModule.forRoot(),
                vex_module_1.VexModalModule,
                file_upload_module_1.FileUploadModule,
                ng2_page_scroll_module_1.Ng2PageScrollModule.forRoot()
            ],
            declarations: [
                app_component_1.AppComponent,
                login_component_1.Login,
                features_component_1.Features,
                start_component_1.Start,
                platform_component_1.Platform,
                pricing_component_1.Pricing,
                support_component_1.Support,
                templates_component_1.Templates,
                area_chart_component_1.AreaChart,
                line_graph_component_1.LineGraph,
                previewer_component_1.Previewer,
                material_example_component_1.MaterialExample,
                preload_image_1.PreloadImage,
                pager_component_1.PagerComponent,
                template_detail_component_1.TemplateDetail
            ],
            providers: [
                platform_browser_1.Title,
                material_1.MdIconRegistry,
                material_1.MdUniqueSelectionDispatcher,
                material_1.MdDialog,
                stat_service_1.StatsService,
                mock_data_service_1.MockDataService,
                vex_module_1.VexModalModule.getProviders(),
                modal_service_1.ModalService,
                user_service_1.UserService,
                auth_service_1.AuthService,
                template_service_1.TemplateService
            ],
            bootstrap: [app_component_1.AppComponent],
            entryComponents: [
                template_detail_component_1.TemplateDetail
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
});

;require.register("app.routes.ts", function(exports, require, module) {
"use strict";
var router_1 = require("@angular/router");
var material_example_component_1 = require("./components/material-example/material-example.component");
var features_component_1 = require("./components/features/features.component");
var login_component_1 = require("./components/login/login.component");
var platform_component_1 = require("./components/platform/platform.component");
var pricing_component_1 = require("./components/pricing/pricing.component");
var support_component_1 = require("./components/support/support.component");
var templates_component_1 = require("./components/templates/templates.component");
var start_component_1 = require("./components/start/start.component");
exports.routes = [
    {
        path: '',
        redirectTo: '/templates',
        pathMatch: 'full',
    },
    {
        label: '로그인',
        path: 'login',
        component: login_component_1.Login,
    },
    {
        label: '플랫폼',
        path: 'platform',
        component: platform_component_1.Platform,
    },
    {
        label: '기능',
        path: 'features',
        component: features_component_1.Features,
    },
    {
        label: '템플릿',
        path: 'templates',
        component: templates_component_1.Templates,
    },
    {
        label: '가격',
        path: 'pricing',
        component: pricing_component_1.Pricing,
    },
    {
        label: '고객지원',
        path: 'support',
        component: support_component_1.Support,
    },
    {
        label: '시작하기',
        path: 'start',
        component: start_component_1.Start,
    },
    {
        label: 'Material 예제',
        path: 'material',
        component: material_example_component_1.MaterialExample,
    }
];
exports.routing = router_1.RouterModule.forRoot(exports.routes);
//# sourceMappingURL=app.routes.js.map
});

require.register("components/app/app.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require("@angular/router");
var ng2_page_scroll_config_1 = require("../../lib/ng2-page-scroll/ng2-page-scroll-config");
var AppComponent = (function () {
    function AppComponent(router) {
        this.router = router;
        ng2_page_scroll_config_1.PageScrollConfig.defaultScrollOffset = 50;
        ng2_page_scroll_config_1.PageScrollConfig.defaultDuration = 350;
    }
    AppComponent.prototype.isActiveUrl = function (url) {
        return this.router.url === "/" + url;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            template: require('./app.component.html'),
            styles: [require('./app.component.css')]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
});

;require.register("components/features/features.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Features = (function () {
    function Features() {
    }
    Features = __decorate([
        core_1.Component({
            selector: 'features',
            template: require('./features.component.html'),
            styles: [require('./features.component.css')]
        }), 
        __metadata('design:paramtypes', [])
    ], Features);
    return Features;
}());
exports.Features = Features;
//# sourceMappingURL=features.component.js.map
});

;require.register("components/login/login.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../../services/auth.service");
var modal_service_1 = require("../../services/modal.service");
var email_format_validator_1 = require("../../shared/validators/email-format.validator");
var _ = require('lodash');
var Login = (function () {
    function Login(fb, authService, modal) {
        this.fb = fb;
        this.authService = authService;
        this.modal = modal;
        this.email = new forms_1.FormControl("");
        this.password = new forms_1.FormControl("");
        this.formErrors = {
            'email': '',
            'password': '',
        };
        this.validationMessages = {
            'email': {
                'required': '이메일은 필수 입력 정보 입니다.',
                'invalidEmail': '맞지않는 이메일 형식입니다.',
            },
            'password': {
                'required': '비밀번호는 필수 입력 정보 입니다.',
            },
        };
    }
    Login.prototype.ngOnInit = function () {
        this.originalLogin = {};
        this.initForm();
        this.configControls();
        this.loadUser();
    };
    Login.prototype.initForm = function () {
        var _this = this;
        this.loginForm = this.fb.group({
            email: this.email,
            password: this.password,
        });
        this.loginForm.statusChanges
            .subscribe(function (data) { return _this.onStatusChanges(data); });
        this.onStatusChanges();
    };
    Login.prototype.configControls = function () {
        this.email.setValue(this.originalLogin.email);
        this.email.setValidators(forms_1.Validators.compose([forms_1.Validators.required, email_format_validator_1.EmailValidator.isValidFormat]));
        this.password.setValue("");
        this.password.setValidators(forms_1.Validators.compose([
            forms_1.Validators.required,
            forms_1.Validators.minLength(9),
        ]));
    };
    Login.prototype.loadUser = function () {
        var _this = this;
        this.authService.getMyUserInfo({})
            .subscribe(function (data) { return _this.result = data; }, function (error) {
            console.error(error);
            var message = '서버 에러';
            _this.result = error;
        });
    };
    Login.prototype.ngAfterViewInit = function () {
        this.firstInput.focus();
    };
    Login.prototype.onStatusChanges = function (data) {
        if (!this.loginForm) {
            return;
        }
        var form = this.loginForm;
        for (var field in this.formErrors) {
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                    break;
                }
            }
        }
    };
    Login.prototype.login = function () {
        var _this = this;
        var login = _.clone(this.loginForm.value);
        this.authService.login(login.email, login.password)
            .subscribe(function (data) { return _this.result = data; }, function (error) {
            console.error(error);
            var message = '서버 에러';
            _this.result = error;
        });
        return false;
    };
    Login.prototype.facebookLogin = function () {
        this.authService.oauth('facebook');
    };
    Login.prototype.googleLogin = function () {
        this.authService.oauth('google');
    };
    __decorate([
        core_1.ViewChild('email'), 
        __metadata('design:type', Object)
    ], Login.prototype, "firstInput", void 0);
    Login = __decorate([
        core_1.Component({
            selector: 'login',
            template: require('./login.component.html'),
            styles: [require('./login.component.css')]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _b) || Object, (typeof (_c = typeof modal_service_1.ModalService !== 'undefined' && modal_service_1.ModalService) === 'function' && _c) || Object])
    ], Login);
    return Login;
    var _a, _b, _c;
}());
exports.Login = Login;
//# sourceMappingURL=login.component.js.map
});

;require.register("components/material-example/material-example.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
require('hammerjs');
var MaterialExample = (function () {
    function MaterialExample() {
        this.myValue = '100%';
        this.i = 0;
    }
    MaterialExample.prototype.ngOnInit = function () {
        var _this = this;
        this.isDisabled = true;
        this.todos = [{
                completed: false,
                name: 'yunseok'
            }, {
                completed: false,
                name: 'hummin'
            }, {
                completed: false,
                name: 'dongho'
            }];
        this.user = {
            agreesToTOS: false
        };
        this.data = [{
                label: 'yunseok',
                value: 'hi'
            }, {
                label: 'hummin',
                value: 'hello'
            }, {
                label: 'dongho',
                value: 'how are you?'
            }];
        this.groupValue = 'hi';
        this.messages = [{
                from: 'home',
                subject: 'charge',
                message: 'hi. how are you? where are you from'
            }, {
                from: 'home',
                subject: 'charge',
                message: 'hi. how are you? where are you from'
            }, {
                from: 'home',
                subject: 'charge',
                message: 'hi. how are you? where are you from'
            }];
        this.links = [
            'temp', 'temp2', 'temp3'
        ];
        this.tiles = [
            { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
            { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
            { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
            { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
        ];
        setInterval(function () {
            _this.i = _this.i + 10;
            _this.i = _this.i % 100;
        }, 100);
        this.pieOptions = [
            '사과파이', '호두파이', '치즈파이'
        ];
    };
    MaterialExample = __decorate([
        core_1.Component({
            selector: 'material-example',
            template: require('./material-example.component.html'),
            styles: [require('./material-example.component.css')]
        }), 
        __metadata('design:paramtypes', [])
    ], MaterialExample);
    return MaterialExample;
}());
exports.MaterialExample = MaterialExample;
var Todos = (function () {
    function Todos() {
    }
    return Todos;
}());
exports.Todos = Todos;
var User = (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
var Data = (function () {
    function Data() {
    }
    return Data;
}());
exports.Data = Data;
var Message = (function () {
    function Message() {
    }
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=material-example.component.js.map
});

;require.register("components/platform/platform.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Platform = (function () {
    function Platform() {
    }
    Platform = __decorate([
        core_1.Component({
            selector: 'platform',
            template: require('./platform.component.html'),
            styles: [require('./platform.component.css')]
        }), 
        __metadata('design:paramtypes', [])
    ], Platform);
    return Platform;
}());
exports.Platform = Platform;
//# sourceMappingURL=platform.component.js.map
});

;require.register("components/preload-image/preload-image.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var PreloadImage = (function () {
    function PreloadImage(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.element = elementRef;
    }
    PreloadImage.prototype.ngDoCheck = function () {
        if (this.element && this.previouseWidth !== this.element.nativeElement.offsetWidth)
            this.setImageStyle();
    };
    PreloadImage.prototype.setImageStyle = function () {
        if (this.ratio && this.element) {
            var height = this.element.nativeElement.offsetWidth * this.ratio;
            this.renderer.setElementStyle(this.element.nativeElement, 'height', height + 'px');
            this.previouseWidth = this.element.nativeElement.offsetWidth;
        }
        if (this.imageStyle)
            if (this.imageStyle)
                for (var key in this.imageStyle) {
                    this.renderer.setElementStyle(this.imagePanel.nativeElement, key, this.imageStyle[key]);
                }
        if (this.imageSource) {
            this.renderer.setElementStyle(this.imagePanel.nativeElement, 'background-image', "url('" + this.imageSource + "')");
            this.renderer.setElementClass(this.loadingPanel.nativeElement, 'done', true);
        }
    };
    PreloadImage.prototype.ngOnChanges = function (changes) {
        if (changes['ratio']) {
            this.setImageStyle();
        }
        if (changes['imageSource']) {
            this.setImageStyle();
        }
    };
    __decorate([
        core_1.ViewChild("imagePanel"), 
        __metadata('design:type', (typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object)
    ], PreloadImage.prototype, "imagePanel", void 0);
    __decorate([
        core_1.ViewChild("loadingPanel"), 
        __metadata('design:type', (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object)
    ], PreloadImage.prototype, "loadingPanel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PreloadImage.prototype, "imageSource", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PreloadImage.prototype, "ratio", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PreloadImage.prototype, "imageStyle", void 0);
    PreloadImage = __decorate([
        core_1.Component({
            selector: 'preload-image',
            template: "\n  <div #imagePanel class=\"preload-image-panel\">\n    <div #loadingPanel class=\"preload-image-loading\">\n    </div>\n    <ng-content></ng-content>\n  </div>\n",
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _d) || Object])
    ], PreloadImage);
    return PreloadImage;
    var _a, _b, _c, _d;
}());
exports.PreloadImage = PreloadImage;
//# sourceMappingURL=preload-image.js.map
});

;require.register("components/previewer/devices.ts", function(exports, require, module) {
"use strict";
var Device = (function () {
    function Device() {
    }
    Device.Android = {
        label: 'Android',
        styles: {
            width: 360,
            height: 640
        }
    };
    Device.IOS = {
        label: 'iOS',
        styles: {
            width: 360,
            height: 640
        }
    };
    Device.GALAXY_S5 = {
        label: 'Galaxy S5',
        styles: {
            width: 360,
            height: 640
        }
    };
    Device.NEXUS_5X = {
        label: 'Nexus 5X',
        styles: {
            width: 412,
            height: 732
        }
    };
    Device.NEXUS_6P = {
        label: 'Nexus 6P',
        styles: {
            width: 412,
            height: 732
        }
    };
    Device.IPHONE_5 = {
        label: 'iPhone 5',
        styles: {
            width: 320,
            height: 568,
        }
    };
    Device.IPHONE_6 = {
        label: 'iPhone 6',
        styles: {
            width: 375,
            height: 667,
        }
    };
    Device.IPHONE_6PLUS = {
        label: 'iPhone 6 Plus',
        styles: {
            width: 414,
            height: 736,
        }
    };
    Device.IPAD = {
        label: 'iPad',
        styles: {
            width: 768,
            height: 1024
        }
    };
    return Device;
}());
exports.Device = Device;
//# sourceMappingURL=devices.js.map
});

;require.register("components/previewer/previewer.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Previewer = (function () {
    function Previewer(renderer, elementRef, http) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.http = http;
        this.hasPreview = false;
        this.deviceBoundingBox = {
            top: 114,
            right: 36,
            left: 34,
            bottom: 104,
            imageRatio: 485 / 960,
            width: 485,
            height: 960
        };
        this.topLeft = {
            top: 0,
            left: 0
        };
    }
    Previewer.prototype.ngOnInit = function () {
        if (!this.previewScale)
            this.previewScale = 0.75;
    };
    Previewer.prototype.ngAfterViewInit = function () {
        this.applyHostStyle();
        if (this.previewApp && this.device && this.device['nativeElement'])
            this.reload(this.previewApp);
    };
    Previewer.prototype.ngOnChanges = function (changes) {
        if (changes['previewApp']) {
            var newSrc = changes['previewApp'].currentValue;
            if (newSrc && this.device && this.device['nativeElement'])
                this.reload(newSrc);
        }
        if (changes['previewScale']) {
            var previewScale = changes['previewScale'].currentValue;
            this.previewScale = previewScale;
            this.applyHostStyle();
        }
        if (changes['previewDevice']) {
            var previewDevice = changes['previewDevice'].currentValue;
            this.previewDevice = previewDevice;
            this.applyHostStyle();
        }
    };
    Previewer.prototype.calculateTopLeft = function () {
        var imageHeight = this.previewerContainer.nativeElement.clientHeight;
        var heightScale = imageHeight / this.deviceBoundingBox.height;
        this.topLeft.top = this.deviceBoundingBox.top * heightScale - 2;
        this.topLeft.left = this.deviceBoundingBox.left * heightScale - 2;
    };
    Previewer.prototype.applyHostStyle = function () {
        if (this.previewerContainer) {
            var imageWidth = this.previewerContainer.nativeElement.clientHeight * this.deviceBoundingBox.imageRatio;
            this.renderer.setElementStyle(this.previewerContainer['nativeElement'], 'width', imageWidth + 'px');
        }
        if (this.device && this.previewDevice) {
            this.calculateTopLeft();
            this.renderer.setElementStyle(this.device['nativeElement'], 'top', (-(this.previewDevice.styles.height * ((1 - this.previewScale) / 2)) + this.topLeft.top) + 'px');
            this.renderer.setElementStyle(this.device['nativeElement'], 'left', (-(this.previewDevice.styles.width * ((1 - this.previewScale) / 2)) + this.topLeft.left) + 'px');
        }
    };
    Previewer.prototype.reload = function (source) {
        var _this = this;
        if (!this.device)
            return;
        if (source) {
            this.http
                .get(source + "/index.html")
                .subscribe(function (data) {
                _this.hasPreview = true;
                _this.renderer.setElementAttribute(_this.device['nativeElement'], "src", source);
                setTimeout(_this.device['nativeElement'].contentWindow.location.reload, 100);
            }, function (err) {
                _this.hasPreview = false;
            });
        }
    };
    __decorate([
        core_1.ViewChild('previewerContainer'), 
        __metadata('design:type', (typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object)
    ], Previewer.prototype, "previewerContainer", void 0);
    __decorate([
        core_1.ViewChild('device'), 
        __metadata('design:type', (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object)
    ], Previewer.prototype, "device", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Previewer.prototype, "previewDevice", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Previewer.prototype, "previewScale", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Previewer.prototype, "previewApp", void 0);
    Previewer = __decorate([
        core_1.Component({
            selector: 'previewer',
            template: require('./previewer.component.html'),
            styles: [require('./previewer.component.css')]
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object, (typeof (_d = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _d) || Object, (typeof (_e = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _e) || Object])
    ], Previewer);
    return Previewer;
    var _a, _b, _c, _d, _e;
}());
exports.Previewer = Previewer;
//# sourceMappingURL=previewer.component.js.map
});

;require.register("components/pricing/pricing.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Pricing = (function () {
    function Pricing() {
    }
    Pricing = __decorate([
        core_1.Component({
            selector: 'pricing',
            template: require('./pricing.component.html'),
            styles: [require('./pricing.component.css')]
        }), 
        __metadata('design:paramtypes', [])
    ], Pricing);
    return Pricing;
}());
exports.Pricing = Pricing;
//# sourceMappingURL=pricing.component.js.map
});

;require.register("components/start/start.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Start = (function () {
    function Start() {
    }
    Start = __decorate([
        core_1.Component({
            selector: 'start',
            template: require('./start.component.html'),
            styles: [require('./start.component.css')]
        }), 
        __metadata('design:paramtypes', [])
    ], Start);
    return Start;
}());
exports.Start = Start;
//# sourceMappingURL=start.component.js.map
});

;require.register("components/support/support.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Support = (function () {
    function Support() {
    }
    Support = __decorate([
        core_1.Component({
            selector: 'support',
            template: require('./support.component.html'),
            styles: [require('./support.component.css')]
        }), 
        __metadata('design:paramtypes', [])
    ], Support);
    return Support;
}());
exports.Support = Support;
//# sourceMappingURL=support.component.js.map
});

;require.register("components/template-detail/template-detail.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var devices_1 = require("../previewer/devices");
var app_config_1 = require("../../app.config");
var TemplateDetail = (function () {
    function TemplateDetail(dialogRef) {
        this.dialogRef = dialogRef;
        this.previewScale = 0.76;
        this.devices = [
            devices_1.Device.Android,
            devices_1.Device.IOS
        ];
    }
    TemplateDetail.prototype.ngOnInit = function () {
        this.selectedMode = 'preview';
        this.isAndroid = true;
        this.previewDevice = devices_1.Device.Android;
        this.loadTemplate();
        this.loadRecommendations();
    };
    TemplateDetail.prototype.loadTemplate = function () {
        this.template = {
            name: "파스텔톤 카페",
            category: "요식업",
            subCategory: "카페",
            tags: [
                { name: "모던" },
                { name: "심플" },
                { name: "럭셔리" },
                { name: "큐티" },
                { name: "로멘틱" },
                { name: "내츄럴" },
                { name: "기타" },
            ],
            features: [
                { name: "스탬프" },
                { name: "쿠폰" },
                { name: "가게소게" },
                { name: "메뉴" },
                { name: "포토" },
                { name: "이벤트" },
                { name: "알림" }
            ],
            description: "모던하고 심플한 카페 템플릿입니다.\n 파스텔톤의 아름다운 그래픽으로 디자인되었습니다.\n 자랑스럽게 보여줄 수 있는 파스텔톤 템플릿으로 나만의 카페 어플리케이션을 제작해보세요.\n",
            photos: [
                {
                    url: "img/mockimg/2.png",
                    tags: ["main"]
                },
                {
                    url: "img/mockimg/0.0.0_splash.png",
                    tags: ["screen-shot"],
                    note: "스플레시 페이지",
                },
                {
                    url: "img/mockimg/1.0.1_main.png",
                    tags: ["screen-shot"],
                    note: "스탬프 페이지",
                },
                {
                    url: "img/mockimg/2.0.1_coupon.png",
                    tags: ["screen-shot"],
                    note: "쿠폰 페이지",
                },
                {
                    url: "img/mockimg/3.0.1_menu.png",
                    tags: ["screen-shot"],
                    note: "메뉴 페이지1",
                },
                {
                    url: "img/mockimg/3.0.2_menu.png",
                    tags: ["screen-shot"],
                    note: "메뉴 페이지2",
                },
                {
                    url: "img/mockimg/4.0.1_introduce.png",
                    tags: ["screen-shot"],
                    note: "소개 페이지",
                },
                {
                    url: "img/mockimg/5.0.1_photo.png",
                    tags: ["screen-shot"],
                    note: "포토 페이지1",
                },
                {
                    url: "img/mockimg/5.2.1_photo_allview.png",
                    tags: ["screen-shot"],
                    note: "포토 페이지2",
                },
                {
                    url: "img/mockimg/5.2.2_photo_allview.png",
                    tags: ["screen-shot"],
                    note: "포토 페이지3",
                },
                {
                    url: "img/mockimg/6.0.1_event.png",
                    tags: ["screen-shot"],
                    note: "이벤트 페이지1",
                },
                {
                    url: "img/mockimg/6.0.2_event_detail.png",
                    tags: ["screen-shot"],
                    note: "이벤트 페이지2",
                },
                {
                    url: "img/mockimg/6.0.3_event_detail.png",
                    tags: ["screen-shot"],
                    note: "이벤트 페이지3",
                },
                {
                    url: "img/mockimg/7.0.1_sideMenu.png",
                    tags: ["screen-shot"],
                    note: "사이드 메뉴",
                }
            ],
            price: 100000,
            salePrice: 50000,
            saleTag: "50%",
            previewUrl: app_config_1.config.templateBucketUrl + '/published/2'
        };
    };
    TemplateDetail.prototype.loadRecommendations = function () {
        this.recommendations = [
            {
                name: "파스텔톤 카페",
                category: "요식업",
                subCategory: "카페",
                tags: [
                    { name: "모던" },
                    { name: "심플" },
                    { name: "럭셔리" },
                    { name: "큐티" },
                    { name: "로멘틱" },
                    { name: "내츄럴" },
                    { name: "기타" },
                ],
                features: [
                    { name: "스탬프" },
                    { name: "쿠폰" },
                    { name: "가게소게" },
                    { name: "메뉴" },
                    { name: "포토" },
                    { name: "이벤트" },
                    { name: "알림" }
                ],
                description: "모던하고 심플한 카페 템플릿입니다. 파스텔톤의 아름다운 그래픽으로 디자인되었습니다. 자랑스럽게 보여줄 수 있는 파스텔톤 템플릿으로 나만의 카페 어플리케이션을 제작해보세요.",
                photos: [{
                        url: "img/mockimg/2.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%",
                previewUrl: app_config_1.config.templateBucketUrl + '/published/2'
            },
            {
                name: "파스텔톤 카페",
                category: "요식업",
                subCategory: "카페",
                tags: [
                    { name: "모던" },
                    { name: "심플" },
                    { name: "럭셔리" },
                    { name: "큐티" },
                    { name: "로멘틱" },
                    { name: "내츄럴" },
                    { name: "기타" },
                ],
                features: [
                    { name: "스탬프" },
                    { name: "쿠폰" },
                    { name: "가게소게" },
                    { name: "메뉴" },
                    { name: "포토" },
                    { name: "이벤트" },
                    { name: "알림" }
                ],
                description: "모던하고 심플한 카페 템플릿입니다. 파스텔톤의 아름다운 그래픽으로 디자인되었습니다. 자랑스럽게 보여줄 수 있는 파스텔톤 템플릿으로 나만의 카페 어플리케이션을 제작해보세요.",
                photos: [{
                        url: "img/mockimg/2.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%",
                previewUrl: app_config_1.config.templateBucketUrl + '/published/2'
            },
            {
                name: "파스텔톤 카페",
                category: "요식업",
                subCategory: "카페",
                tags: [
                    { name: "모던" },
                    { name: "심플" },
                    { name: "럭셔리" },
                    { name: "큐티" },
                    { name: "로멘틱" },
                    { name: "내츄럴" },
                    { name: "기타" },
                ],
                features: [
                    { name: "스탬프" },
                    { name: "쿠폰" },
                    { name: "가게소게" },
                    { name: "메뉴" },
                    { name: "포토" },
                    { name: "이벤트" },
                    { name: "알림" }
                ],
                description: "모던하고 심플한 카페 템플릿입니다. 파스텔톤의 아름다운 그래픽으로 디자인되었습니다. 자랑스럽게 보여줄 수 있는 파스텔톤 템플릿으로 나만의 카페 어플리케이션을 제작해보세요.",
                photos: [{
                        url: "img/mockimg/2.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%",
                previewUrl: app_config_1.config.templateBucketUrl + '/published/2'
            }
        ];
    };
    TemplateDetail.prototype.isScreenShot = function (tags) {
        if (!tags)
            return false;
        return tags.indexOf("screen-shot") > -1;
    };
    TemplateDetail = __decorate([
        core_1.Component({
            selector: 'template-detail',
            template: require('./template-detail.component.html'),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof material_1.MdDialogRef !== 'undefined' && material_1.MdDialogRef) === 'function' && _a) || Object])
    ], TemplateDetail);
    return TemplateDetail;
    var _a;
}());
exports.TemplateDetail = TemplateDetail;
//# sourceMappingURL=template-detail.component.js.map
});

;require.register("components/templates/templates.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var ng2_page_scroll_service_1 = require("../../lib/ng2-page-scroll/ng2-page-scroll.service");
var platform_browser_1 = require("@angular/platform-browser");
var ng2_page_scroll_instance_1 = require("../../lib/ng2-page-scroll/ng2-page-scroll-instance");
var material_1 = require("@angular/material");
var template_detail_component_1 = require("../template-detail/template-detail.component");
var Templates = (function () {
    function Templates(pageScrollService, document, dialog) {
        this.pageScrollService = pageScrollService;
        this.document = document;
        this.dialog = dialog;
        this.categories = [
            {
                label: "요식업",
                subCategories: [
                    "카페",
                    "레스토랑",
                    "술집",
                    "일반 음식점",
                ]
            },
            {
                label: "숙박업",
                subCategories: [
                    "호텔",
                    "펜션",
                    "모텔"
                ]
            },
            {
                label: "의료업",
                subCategories: [
                    "병원",
                    "치과"
                ]
            },
            {
                label: "뷰티",
                subCategories: [
                    "화장품",
                    "미용실",
                    "네일아트",
                    "마사지",
                ]
            },
            {
                label: "교육",
                subCategories: [
                    "학교",
                    "학원",
                ]
            },
            {
                label: "비즈니스",
                subCategories: [
                    "일반회사",
                    "영업용",
                    "엔터테인먼트",
                    "에이전시",
                    "개인"
                ]
            }
        ];
        this.mainTags = [
            { label: "전체" },
            { label: "심플" },
            { label: "모던", newItem: true },
            { label: "럭셔리" },
            { label: "큐티" },
            { label: "로맨틱" },
            { label: "내츄럴", newItem: true },
            { label: "기타" },
        ];
        this.colorFilters = [
            { label: "ALL", image: "img/ic_color_all.png" },
            { label: "WHITE", image: "img/ic_color_white.png" },
            { label: "BLACK", image: "img/ic_color_black.png" },
            { label: "GRAY", image: "img/ic_color_gray.png" },
            { label: "RED", image: "img/ic_color_red.png" },
            { label: "YELLOW", image: "img/ic_color_yellow.png" },
            { label: "BLUE", image: "img/ic_color_blue.png" },
            { label: "GREEN", image: "img/ic_color_green.png" },
            { label: "PURPLE", image: "img/ic_color_purple.png" },
            { label: "BROWN", image: "img/ic_color_brown.png" },
        ];
        this.isColorOptionOpened = false;
        this.cssClasses = {
            sortAscending: 'icon-down',
            sortDescending: 'icon-up',
            pagerLeftArrow: 'icon-left',
            pagerRightArrow: 'icon-right',
            pagerPrevious: 'icon-prev',
            pagerNext: 'icon-skip'
        };
        this.config = new material_1.MdDialogConfig();
        this.templates = [
            {
                name: "모던 카페",
                photos: [{
                        url: "img/mockimg/1.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "파스텔톤 카페",
                photos: [{
                        url: "img/mockimg/2.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "싱그러운 카페",
                photos: [{
                        url: "img/mockimg/3.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "오렌지 테라스 카페",
                photos: [{
                        url: "img/mockimg/4.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "커피향 가득한 카페",
                photos: [{
                        url: "img/mockimg/5.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "베이커리 카페",
                photos: [{
                        url: "img/mockimg/6.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "브런치가 맛있는 카페",
                photos: [{
                        url: "img/mockimg/7.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "Espresso 카페",
                photos: [{
                        url: "img/mockimg/2.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "우유커품 카페",
                photos: [{
                        url: "img/mockimg/3.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "오렌지 테라스 카페",
                photos: [{
                        url: "img/mockimg/4.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "커피향 가득한 카페",
                photos: [{
                        url: "img/mockimg/5.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "베이커리 카페",
                photos: [{
                        url: "img/mockimg/6.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "브런치가 맛있는 카페",
                photos: [{
                        url: "img/mockimg/1.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "Espresso 카페",
                photos: [{
                        url: "img/mockimg/7.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            },
            {
                name: "우유커품 카페",
                photos: [{
                        url: "img/mockimg/1.png"
                    }],
                price: 100000,
                salePrice: 50000,
                saleTag: "50%"
            }
        ];
    }
    Templates.prototype.ngOnInit = function () {
        this.selectSubCategory(this.categories[0], this.categories[0].subCategories[0]);
        this.selectTag(this.mainTags[0]);
        this.selectColor(this.colorFilters[0]);
        this.selectSort('가격낮은순');
        this.curPage = 1;
        this.pageSize = 12;
        this.loadPage({ page: this.curPage });
        this.config.disableClose = false;
        this.config.width = '820px';
        this.config.height = '820px';
    };
    Templates.prototype.loadPage = function (event) {
        console.log(event);
        this.rowCount = 1000;
    };
    Templates.prototype.openDialog = function () {
        var _this = this;
        this.dialogRef = this.dialog.open(template_detail_component_1.TemplateDetail, this.config);
        this.dialogRef.afterClosed().subscribe(function (result) {
            console.log('result: ' + result);
            _this.dialogRef = null;
        });
    };
    Templates.prototype.isCategorySelected = function (name) {
        return this.selectedCategory.label === name;
    };
    Templates.prototype.isSubCategorySelected = function (name) {
        return this.selectedSubCategory === name;
    };
    Templates.prototype.selectSubCategory = function (category, subCategory) {
        this.selectedCategory = category;
        this.selectedSubCategory = subCategory;
    };
    Templates.prototype.isTagSelected = function (name) {
        return this.selectedTag.label === name;
    };
    Templates.prototype.selectTag = function (tag) {
        return this.selectedTag = tag;
    };
    Templates.prototype.isSortSelected = function (name) {
        return this.selectedSort === name;
    };
    Templates.prototype.selectSort = function (name) {
        return this.selectedSort = name;
    };
    Templates.prototype.isSelectedColor = function (label) {
        return this.selectedColor.label === label;
    };
    Templates.prototype.toggleColorSelector = function (event, option) {
        event.stopPropagation();
        this.isColorOptionOpened = option;
    };
    Templates.prototype.selectColor = function (color) {
        this.selectedColor = color;
    };
    Templates.prototype.goToHead = function () {
        var pageScrollInstance = ng2_page_scroll_instance_1.PageScrollInstance.simpleInstance(this.document, '#app');
        this.pageScrollService.start(pageScrollInstance);
    };
    ;
    Templates = __decorate([
        core_1.Component({
            selector: 'templates',
            template: require('./templates.component.html'),
            styles: [require('./templates.component.css')]
        }),
        __param(1, core_1.Inject(platform_browser_1.DOCUMENT)), 
        __metadata('design:paramtypes', [(typeof (_a = typeof ng2_page_scroll_service_1.PageScrollService !== 'undefined' && ng2_page_scroll_service_1.PageScrollService) === 'function' && _a) || Object, Object, (typeof (_b = typeof material_1.MdDialog !== 'undefined' && material_1.MdDialog) === 'function' && _b) || Object])
    ], Templates);
    return Templates;
    var _a, _b;
}());
exports.Templates = Templates;
//# sourceMappingURL=templates.component.js.map
});

;require.register("directives/area-chart/area-chart.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var D3 = require('d3');
var Moment = require('moment');
var AreaChartConfig = (function () {
    function AreaChartConfig() {
    }
    return AreaChartConfig;
}());
exports.AreaChartConfig = AreaChartConfig;
var AreaChart = (function () {
    function AreaChart(element) {
        this.element = element;
        this.htmlElement = this.element.nativeElement;
        this.host = D3.select(this.element.nativeElement);
    }
    AreaChart.prototype.ngOnChanges = function () {
        if (!this.config || this.config.length === 0)
            return;
        this.setup();
        this.buildSVG();
        this.populate();
        this.drawXAxis();
        this.drawYAxis();
    };
    AreaChart.prototype.setup = function () {
        this.margin = { top: 10, right: 20, bottom: 30, left: 80 };
        this.width = this.htmlElement.clientWidth - this.margin.left - this.margin.right;
        this.height = this.width * 0.15 - this.margin.top - this.margin.bottom;
        this.xScale = D3.scaleTime().range([0, this.width]);
        this.yScale = D3.scaleLinear().range([this.height, 0]);
    };
    AreaChart.prototype.buildSVG = function () {
        this.host.html('');
        this.svg = this.host.append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    };
    AreaChart.prototype.drawXAxis = function () {
        this.xAxis = D3.axisBottom(this.xScale)
            .tickFormat(function (t) { return Moment(t).format('HH:mm:ss').toUpperCase(); })
            .tickPadding(5);
        this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis);
    };
    AreaChart.prototype.drawYAxis = function () {
        this.yAxis = D3.axisLeft(this.yScale)
            .tickPadding(10);
        this.svg.append('g')
            .attr('class', 'y axis')
            .call(this.yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)');
    };
    AreaChart.prototype.getMaxY = function () {
        var maxValuesOfAreas = [];
        this.config.forEach(function (data) { return maxValuesOfAreas.push(Math.max.apply(Math, data.dataset.map(function (d) { return d.y; }))); });
        return Math.max.apply(this, maxValuesOfAreas);
    };
    AreaChart.prototype.populate = function () {
        var _this = this;
        this.config.forEach(function (area) {
            _this.xScale.domain(D3.extent(area.dataset, function (d) { return d.x; }));
            _this.yScale.domain([0, _this.getMaxY()]);
            _this.svg.append('path')
                .datum(area.dataset)
                .attr('class', 'area')
                .style('fill', area.settings.fill)
                .attr('d', D3.area()
                .x(function (d) { return _this.xScale(d.x); })
                .y0(_this.height)
                .y1(function (d) { return _this.yScale(d.y); }));
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AreaChart.prototype, "config", void 0);
    AreaChart = __decorate([
        core_1.Component({
            selector: 'area-chart',
            template: "<ng-content></ng-content>",
            styles: [require('./area-chart.component.css')]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], AreaChart);
    return AreaChart;
    var _a;
}());
exports.AreaChart = AreaChart;
//# sourceMappingURL=area-chart.component.js.map
});

;require.register("directives/line-graph/line-graph.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var D3 = require('d3');
var Moment = require('moment');
var LineGraphConfig = (function () {
    function LineGraphConfig() {
    }
    return LineGraphConfig;
}());
exports.LineGraphConfig = LineGraphConfig;
var LineGraph = (function () {
    function LineGraph(element) {
        this.element = element;
        this.onDrawDone = new core_1.EventEmitter();
        this.htmlElement = this.element.nativeElement;
        this.host = D3.select(this.element.nativeElement);
    }
    LineGraph.prototype.ngOnChanges = function () {
        if (!this.config || this.config.length === 0)
            return;
        this.setup();
        this.buildSVG();
        this.populate();
        this.drawXAxis();
        this.drawYAxis();
        this.drawDone();
    };
    LineGraph.prototype.setup = function () {
        this.margin = { top: 10, right: 20, bottom: 20, left: 80 };
        this.width = this.htmlElement.clientWidth - this.margin.left - this.margin.right;
        this.height = Math.max(150, this.width * 0.15 - this.margin.top - this.margin.bottom);
        this.xScale = D3.scaleTime().range([0, this.width]);
        this.yScale = D3.scaleLinear().range([this.height, 0]);
    };
    LineGraph.prototype.buildSVG = function () {
        this.host.html('');
        this.svg = this.host.append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    };
    LineGraph.prototype.drawXAxis = function () {
        this.xAxis = D3.axisBottom(this.xScale)
            .tickFormat(function (t) { return Moment(t).format('HH:mm:ss').toUpperCase(); })
            .tickPadding(5);
        this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis);
    };
    LineGraph.prototype.drawYAxis = function () {
        this.yAxis = D3.axisLeft(this.yScale)
            .tickPadding(10);
        this.svg.append('g')
            .attr('class', 'y axis')
            .call(this.yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)');
    };
    LineGraph.prototype.getMaxY = function () {
        var maxValuesOfAreas = [];
        this.config.forEach(function (data) { return maxValuesOfAreas.push(Math.max.apply(Math, data.dataset.map(function (d) { return d.y; }))); });
        return Math.max.apply(this, maxValuesOfAreas);
    };
    LineGraph.prototype.populate = function () {
        var _this = this;
        this.config.forEach(function (area) {
            _this.xScale.domain(D3.extent(area.dataset, function (d) { return d.x; }));
            _this.yScale.domain([0, _this.getMaxY()]);
            _this.svg.append('path')
                .datum(area.dataset)
                .style('stroke', area.settings.stroke)
                .attr('class', 'line')
                .attr('d', D3.line()
                .x(function (d) { return _this.xScale(d.x); })
                .y(function (d) { return _this.yScale(d.y); }));
        });
    };
    LineGraph.prototype.drawDone = function () {
        this.onDrawDone.emit(null);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], LineGraph.prototype, "config", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], LineGraph.prototype, "onDrawDone", void 0);
    LineGraph = __decorate([
        core_1.Component({
            selector: 'line-graph',
            template: "<ng-content></ng-content>",
            styles: [require('./line-graph.component.css')]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
    ], LineGraph);
    return LineGraph;
    var _a, _b;
}());
exports.LineGraph = LineGraph;
//# sourceMappingURL=line-graph.component.js.map
});

;require.register("lib/ng2-file-upload/components/file-upload/file-drop.directive.spec.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var testing_1 = require('@angular/core/testing');
var file_uploader_class_1 = require('./file-uploader.class');
var file_upload_module_1 = require('./file-upload.module');
var ContainerComponent = (function () {
    function ContainerComponent() {
        this.uploader = new file_uploader_class_1.FileUploader({ url: 'localhost:3000' });
    }
    ContainerComponent = __decorate([
        core_1.Component({
            selector: 'container',
            template: "<input type=\"file\" ng2FileSelect [uploader]=\"uploader\" />"
        }), 
        __metadata('design:paramtypes', [])
    ], ContainerComponent);
    return ContainerComponent;
}());
exports.ContainerComponent = ContainerComponent;
describe('Directive: FileSelectDirective', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [file_upload_module_1.FileUploadModule],
            declarations: [ContainerComponent],
            providers: [ContainerComponent]
        });
    });
    it('should be fine', testing_1.inject([ContainerComponent], function (fixture) {
        expect(fixture).not.toBeNull();
    }));
});
//# sourceMappingURL=file-drop.directive.spec.js.map
});

require.register("lib/ng2-file-upload/components/file-upload/file-drop.directive.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var file_uploader_class_1 = require('./file-uploader.class');
var FileDropDirective = (function () {
    function FileDropDirective(element) {
        this.fileOver = new core_1.EventEmitter();
        this.onFileDrop = new core_1.EventEmitter();
        this.element = element;
    }
    FileDropDirective.prototype.getOptions = function () {
        return this.uploader.options;
    };
    FileDropDirective.prototype.getFilters = function () {
        return {};
    };
    FileDropDirective.prototype.onDrop = function (event) {
        var transfer = this._getTransfer(event);
        if (!transfer) {
            return;
        }
        var options = this.getOptions();
        var filters = this.getFilters();
        this._preventAndStop(event);
        this.uploader.addToQueue(transfer.files, options, filters);
        this.fileOver.emit(false);
        this.onFileDrop.emit(transfer.files);
    };
    FileDropDirective.prototype.onDragOver = function (event) {
        var transfer = this._getTransfer(event);
        if (!this._haveFiles(transfer.types)) {
            return;
        }
        transfer.dropEffect = 'copy';
        this._preventAndStop(event);
        this.fileOver.emit(true);
    };
    FileDropDirective.prototype.onDragLeave = function (event) {
        if (event.currentTarget === this.element[0]) {
            return;
        }
        this._preventAndStop(event);
        this.fileOver.emit(false);
    };
    FileDropDirective.prototype._getTransfer = function (event) {
        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
    };
    FileDropDirective.prototype._preventAndStop = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    FileDropDirective.prototype._haveFiles = function (types) {
        if (!types) {
            return false;
        }
        if (types.indexOf) {
            return types.indexOf('Files') !== -1;
        }
        else if (types.contains) {
            return types.contains('Files');
        }
        else {
            return false;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof file_uploader_class_1.FileUploader !== 'undefined' && file_uploader_class_1.FileUploader) === 'function' && _a) || Object)
    ], FileDropDirective.prototype, "uploader", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], FileDropDirective.prototype, "fileOver", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_c = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _c) || Object)
    ], FileDropDirective.prototype, "onFileDrop", void 0);
    __decorate([
        core_1.HostListener('drop', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], FileDropDirective.prototype, "onDrop", null);
    __decorate([
        core_1.HostListener('dragover', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], FileDropDirective.prototype, "onDragOver", null);
    __decorate([
        core_1.HostListener('dragleave', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', Object)
    ], FileDropDirective.prototype, "onDragLeave", null);
    FileDropDirective = __decorate([
        core_1.Directive({ selector: '[ng2FileDrop]' }), 
        __metadata('design:paramtypes', [(typeof (_d = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _d) || Object])
    ], FileDropDirective);
    return FileDropDirective;
    var _a, _b, _c, _d;
}());
exports.FileDropDirective = FileDropDirective;
//# sourceMappingURL=file-drop.directive.js.map
});

;require.register("lib/ng2-file-upload/components/file-upload/file-item.class.ts", function(exports, require, module) {
"use strict";
var file_like_object_class_1 = require('./file-like-object.class');
var FileItem = (function () {
    function FileItem(uploader, some, options) {
        this.url = '/';
        this.headers = [];
        this.withCredentials = true;
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
        this.index = void 0;
        this.uploader = uploader;
        this.some = some;
        this.options = options;
        this.file = new file_like_object_class_1.FileLikeObject(some);
        this._file = some;
        if (uploader.options) {
            this.method = uploader.options.method || 'POST';
            this.alias = uploader.options.itemAlias || 'file';
        }
        if (options.formData) {
            this.formData = options.formData;
        }
        this.url = uploader.options.url;
    }
    FileItem.prototype.upload = function () {
        try {
            this.uploader.uploadItem(this);
        }
        catch (e) {
            this.uploader._onCompleteItem(this, '', 0, {});
            this.uploader._onErrorItem(this, '', 0, {});
        }
    };
    FileItem.prototype.cancel = function () {
        this.uploader.cancelItem(this);
    };
    FileItem.prototype.remove = function () {
        this.uploader.removeFromQueue(this);
    };
    FileItem.prototype.onBeforeUpload = function () {
        return void 0;
    };
    FileItem.prototype.onBuildForm = function (form) {
        return { form: form };
    };
    FileItem.prototype.onProgress = function (progress) {
        return { progress: progress };
    };
    FileItem.prototype.onSuccess = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype.onError = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype.onCancel = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype.onComplete = function (response, status, headers) {
        return { response: response, status: status, headers: headers };
    };
    FileItem.prototype._onBeforeUpload = function () {
        this.isReady = true;
        this.isUploading = true;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
        this.onBeforeUpload();
    };
    FileItem.prototype._onBuildForm = function (form) {
        this.onBuildForm(form);
    };
    FileItem.prototype._onProgress = function (progress) {
        this.progress = progress;
        this.onProgress(progress);
    };
    FileItem.prototype._onSuccess = function (response, status, headers) {
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = true;
        this.isSuccess = true;
        this.isCancel = false;
        this.isError = false;
        this.progress = 100;
        this.index = void 0;
        this.onSuccess(response, status, headers);
    };
    FileItem.prototype._onError = function (response, status, headers) {
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = true;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = true;
        this.progress = 0;
        this.index = void 0;
        this.onError(response, status, headers);
    };
    FileItem.prototype._onCancel = function (response, status, headers) {
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = true;
        this.isError = false;
        this.progress = 0;
        this.index = void 0;
        this.onCancel(response, status, headers);
    };
    FileItem.prototype._onComplete = function (response, status, headers) {
        this.onComplete(response, status, headers);
        if (this.uploader.options.removeAfterUpload) {
            this.remove();
        }
    };
    FileItem.prototype._prepareToUploading = function () {
        this.index = this.index || ++this.uploader._nextIndex;
        this.isReady = true;
    };
    return FileItem;
}());
exports.FileItem = FileItem;
//# sourceMappingURL=file-item.class.js.map
});

;require.register("lib/ng2-file-upload/components/file-upload/file-like-object.class.ts", function(exports, require, module) {
"use strict";
function isElement(node) {
    return !!(node && (node.nodeName || node.prop && node.attr && node.find));
}
var FileLikeObject = (function () {
    function FileLikeObject(fileOrInput) {
        var isInput = isElement(fileOrInput);
        var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
        var postfix = typeof fakePathOrObject === 'string' ? 'FakePath' : 'Object';
        var method = '_createFrom' + postfix;
        this[method](fakePathOrObject);
    }
    FileLikeObject.prototype._createFromFakePath = function (path) {
        this.lastModifiedDate = void 0;
        this.size = void 0;
        this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
        this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
    };
    FileLikeObject.prototype._createFromObject = function (object) {
        this.size = object.size;
        this.type = object.type;
        this.name = object.name;
    };
    return FileLikeObject;
}());
exports.FileLikeObject = FileLikeObject;
//# sourceMappingURL=file-like-object.class.js.map
});

;require.register("lib/ng2-file-upload/components/file-upload/file-select.directive.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var file_uploader_class_1 = require('./file-uploader.class');
var FileSelectDirective = (function () {
    function FileSelectDirective(element) {
        this.element = element;
    }
    FileSelectDirective.prototype.getOptions = function () {
        return this.uploader.options;
    };
    FileSelectDirective.prototype.getFilters = function () {
        return void 0;
    };
    FileSelectDirective.prototype.isEmptyAfterSelection = function () {
        return !!this.element.nativeElement.attributes.multiple;
    };
    FileSelectDirective.prototype.onChange = function () {
        var files = this.element.nativeElement.files;
        var options = this.getOptions();
        var filters = this.getFilters();
        this.uploader.addToQueue(files, options, filters);
        if (this.isEmptyAfterSelection()) {
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof file_uploader_class_1.FileUploader !== 'undefined' && file_uploader_class_1.FileUploader) === 'function' && _a) || Object)
    ], FileSelectDirective.prototype, "uploader", void 0);
    __decorate([
        core_1.HostListener('change'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', Object)
    ], FileSelectDirective.prototype, "onChange", null);
    FileSelectDirective = __decorate([
        core_1.Directive({ selector: '[ng2FileSelect]' }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
    ], FileSelectDirective);
    return FileSelectDirective;
    var _a, _b;
}());
exports.FileSelectDirective = FileSelectDirective;
//# sourceMappingURL=file-select.directive.js.map
});

;require.register("lib/ng2-file-upload/components/file-upload/file-type.class.ts", function(exports, require, module) {
"use strict";
var FileType = (function () {
    function FileType() {
    }
    FileType.getMimeClass = function (file) {
        var mimeClass = 'application';
        if (this.mime_psd.indexOf(file.type) !== -1) {
            mimeClass = 'image';
        }
        else if (file.type.match('image.*')) {
            mimeClass = 'image';
        }
        else if (file.type.match('video.*')) {
            mimeClass = 'video';
        }
        else if (file.type.match('audio.*')) {
            mimeClass = 'audio';
        }
        else if (file.type === 'application/pdf') {
            mimeClass = 'pdf';
        }
        else if (this.mime_compress.indexOf(file.type) !== -1) {
            mimeClass = 'compress';
        }
        else if (this.mime_doc.indexOf(file.type) !== -1) {
            mimeClass = 'doc';
        }
        else if (this.mime_xsl.indexOf(file.type) !== -1) {
            mimeClass = 'xls';
        }
        else if (this.mime_ppt.indexOf(file.type) !== -1) {
            mimeClass = 'ppt';
        }
        if (mimeClass === 'application') {
            mimeClass = this.fileTypeDetection(file.name);
        }
        return mimeClass;
    };
    FileType.fileTypeDetection = function (inputFilename) {
        var types = {
            'jpg': 'image',
            'jpeg': 'image',
            'tif': 'image',
            'psd': 'image',
            'bmp': 'image',
            'png': 'image',
            'nef': 'image',
            'tiff': 'image',
            'cr2': 'image',
            'dwg': 'image',
            'cdr': 'image',
            'ai': 'image',
            'indd': 'image',
            'pin': 'image',
            'cdp': 'image',
            'skp': 'image',
            'stp': 'image',
            '3dm': 'image',
            'mp3': 'audio',
            'wav': 'audio',
            'wma': 'audio',
            'mod': 'audio',
            'm4a': 'audio',
            'compress': 'compress',
            'rar': 'compress',
            '7z': 'compress',
            'lz': 'compress',
            'z01': 'compress',
            'pdf': 'pdf',
            'xls': 'xls',
            'xlsx': 'xls',
            'ods': 'xls',
            'mp4': 'video',
            'avi': 'video',
            'wmv': 'video',
            'mpg': 'video',
            'mts': 'video',
            'flv': 'video',
            '3gp': 'video',
            'vob': 'video',
            'm4v': 'video',
            'mpeg': 'video',
            'm2ts': 'video',
            'mov': 'video',
            'doc': 'doc',
            'docx': 'doc',
            'eps': 'doc',
            'txt': 'doc',
            'odt': 'doc',
            'rtf': 'doc',
            'ppt': 'ppt',
            'pptx': 'ppt',
            'pps': 'ppt',
            'ppsx': 'ppt',
            'odp': 'ppt'
        };
        var chunks = inputFilename.split('.');
        if (chunks.length < 2) {
            return 'application';
        }
        var extension = chunks[chunks.length - 1].toLowerCase();
        if (types[extension] === undefined) {
            return 'application';
        }
        else {
            return types[extension];
        }
    };
    FileType.mime_doc = [
        'application/msword',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'application/vnd.ms-word.document.macroEnabled.12',
        'application/vnd.ms-word.template.macroEnabled.12'
    ];
    FileType.mime_xsl = [
        'application/vnd.ms-excel',
        'application/vnd.ms-excel',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.template.macroEnabled.12',
        'application/vnd.ms-excel.addin.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
    ];
    FileType.mime_ppt = [
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.presentationml.template',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'application/vnd.ms-powerpoint.addin.macroEnabled.12',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
    ];
    FileType.mime_psd = [
        'image/photoshop',
        'image/x-photoshop',
        'image/psd',
        'application/photoshop',
        'application/psd',
        'zz-application/zz-winassoc-psd'
    ];
    FileType.mime_compress = [
        'application/x-gtar',
        'application/x-gcompress',
        'application/compress',
        'application/x-tar',
        'application/x-rar-compressed',
        'application/octet-stream'
    ];
    return FileType;
}());
exports.FileType = FileType;
//# sourceMappingURL=file-type.class.js.map
});

;require.register("lib/ng2-file-upload/components/file-upload/file-upload.module.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var file_drop_directive_1 = require('./file-drop.directive');
var file_select_directive_1 = require('./file-select.directive');
var FileUploadModule = (function () {
    function FileUploadModule() {
    }
    FileUploadModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [file_drop_directive_1.FileDropDirective, file_select_directive_1.FileSelectDirective],
            exports: [file_drop_directive_1.FileDropDirective, file_select_directive_1.FileSelectDirective]
        }), 
        __metadata('design:paramtypes', [])
    ], FileUploadModule);
    return FileUploadModule;
}());
exports.FileUploadModule = FileUploadModule;
//# sourceMappingURL=file-upload.module.js.map
});

;require.register("lib/ng2-file-upload/components/file-upload/file-uploader.class.ts", function(exports, require, module) {
"use strict";
var file_like_object_class_1 = require('./file-like-object.class');
var file_item_class_1 = require('./file-item.class');
var file_type_class_1 = require('./file-type.class');
var core_1 = require("@angular/core");
var _ = require("lodash");
function isFile(value) {
    return (File && value instanceof File);
}
var FileUploader = (function () {
    function FileUploader(options) {
        this.completeAll = new core_1.EventEmitter();
        this.isUploading = false;
        this.queue = [];
        this.progress = 0;
        this._nextIndex = 0;
        this.options = {
            autoUpload: false,
            isHTML5: true,
            filters: [],
            removeAfterUpload: false,
            disableMultipart: false
        };
        this.setOptions(options);
    }
    FileUploader.prototype.setOptions = function (options) {
        this.options = Object.assign(this.options, options);
        this.authToken = options.authToken;
        this.authTokenHeader = options.authTokenHeader || 'Authorization';
        this.autoUpload = options.autoUpload;
        this.options.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });
        if (this.options.maxFileSize) {
            this.options.filters.unshift({ name: 'fileSize', fn: this._fileSizeFilter });
        }
        if (this.options.allowedFileType) {
            this.options.filters.unshift({ name: 'fileType', fn: this._fileTypeFilter });
        }
        if (this.options.allowedMimeType) {
            this.options.filters.unshift({ name: 'mimeType', fn: this._mimeTypeFilter });
        }
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].url = this.options.url;
        }
    };
    FileUploader.prototype.addToQueue = function (files, options, filters) {
        var _this = this;
        var list = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            list.push(file);
        }
        var arrayOfFilters = this._getFilters(filters);
        var count = this.queue.length;
        var addedFileItems = [];
        list.map(function (some) {
            if (!options) {
                options = _this.options;
            }
            var temp = new file_like_object_class_1.FileLikeObject(some);
            if (_this._isValidFile(temp, arrayOfFilters, options)) {
                var fileItem = new file_item_class_1.FileItem(_this, some, options);
                addedFileItems.push(fileItem);
                _this.queue.push(fileItem);
                _this._onAfterAddingFile(fileItem);
            }
            else {
                var filter = arrayOfFilters[_this._failFilterIndex];
                _this._onWhenAddingFileFailed(temp, filter, options);
            }
        });
        if (this.queue.length !== count) {
            this._onAfterAddingAll(addedFileItems);
            this.progress = this._getTotalProgress();
        }
        this._render();
        if (this.options.autoUpload) {
            this.uploadAll();
        }
    };
    FileUploader.prototype.removeFromQueue = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        if (item.isUploading) {
            item.cancel();
        }
        this.queue.splice(index, 1);
        this.progress = this._getTotalProgress();
    };
    FileUploader.prototype.clearQueue = function () {
        while (this.queue.length) {
            this.queue[0].remove();
        }
        this.progress = 0;
    };
    FileUploader.prototype.uploadItem = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        var transport = this.options.isHTML5 ? '_xhrTransport' : '_iframeTransport';
        item._prepareToUploading();
        if (this.isUploading) {
            return;
        }
        this.isUploading = true;
        this[transport](item);
    };
    FileUploader.prototype.cancelItem = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        var prop = this.options.isHTML5 ? item._xhr : item._form;
        if (item && item.isUploading) {
            prop.abort();
        }
    };
    FileUploader.prototype.uploadAll = function () {
        var items = this.getNotUploadedItems().filter(function (item) { return !item.isUploading; });
        if (!items.length) {
            return;
        }
        items.map(function (item) { return item._prepareToUploading(); });
        items[0].upload();
    };
    FileUploader.prototype.cancelAll = function () {
        var items = this.getNotUploadedItems();
        items.map(function (item) { return item.cancel(); });
    };
    FileUploader.prototype.isFile = function (value) {
        return isFile(value);
    };
    FileUploader.prototype.isFileLikeObject = function (value) {
        return value instanceof file_like_object_class_1.FileLikeObject;
    };
    FileUploader.prototype.getIndexOfItem = function (value) {
        return typeof value === 'number' ? value : this.queue.indexOf(value);
    };
    FileUploader.prototype.getNotUploadedItems = function () {
        return this.queue.filter(function (item) { return !item.isUploaded; });
    };
    FileUploader.prototype.getReadyItems = function () {
        return this.queue
            .filter(function (item) { return (item.isReady && !item.isUploading); })
            .sort(function (item1, item2) { return item1.index - item2.index; });
    };
    FileUploader.prototype.destroy = function () {
        return void 0;
    };
    FileUploader.prototype.onAfterAddingAll = function (fileItems) {
        return { fileItems: fileItems };
    };
    FileUploader.prototype.onBuildItemForm = function (fileItem, form) {
        return { fileItem: fileItem, form: form };
    };
    FileUploader.prototype.onAfterAddingFile = function (fileItem) {
        return { fileItem: fileItem };
    };
    FileUploader.prototype.onWhenAddingFileFailed = function (item, filter, options) {
        return { item: item, filter: filter, options: options };
    };
    FileUploader.prototype.onBeforeUploadItem = function (fileItem) {
        return { fileItem: fileItem };
    };
    FileUploader.prototype.onProgressItem = function (fileItem, progress) {
        return { fileItem: fileItem, progress: progress };
    };
    FileUploader.prototype.onProgressAll = function (progress) {
        return { progress: progress };
    };
    FileUploader.prototype.onSuccessItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onErrorItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCancelItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCompleteItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCompleteAll = function () {
        this.completeAll.emit();
        return void 0;
    };
    FileUploader.prototype._mimeTypeFilter = function (item) {
        return !(this.options.allowedMimeType && this.options.allowedMimeType.indexOf(item.type) === -1);
    };
    FileUploader.prototype._fileSizeFilter = function (item) {
        return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
    };
    FileUploader.prototype._fileTypeFilter = function (item) {
        return !(this.options.allowedFileType &&
            this.options.allowedFileType.indexOf(file_type_class_1.FileType.getMimeClass(item)) === -1);
    };
    FileUploader.prototype._onErrorItem = function (item, response, status, headers) {
        item._onError(response, status, headers);
        this.onErrorItem(item, response, status, headers);
    };
    FileUploader.prototype._onCompleteItem = function (item, response, status, headers) {
        item._onComplete(response, status, headers);
        this.onCompleteItem(item, response, status, headers);
        var nextItem = this.getReadyItems()[0];
        this.isUploading = false;
        if (nextItem) {
            nextItem.upload();
            return;
        }
        this.onCompleteAll();
        this.progress = this._getTotalProgress();
        this._render();
    };
    FileUploader.prototype._headersGetter = function (parsedHeaders) {
        return function (name) {
            if (name) {
                return parsedHeaders[name.toLowerCase()] || void 0;
            }
            return parsedHeaders;
        };
    };
    FileUploader.prototype._xhrTransport = function (item) {
        var _this = this;
        var xhr = item._xhr = new XMLHttpRequest();
        var sendable;
        this._onBeforeUploadItem(item);
        if (typeof item._file.size !== 'number') {
            throw new TypeError('The file specified is no longer valid');
        }
        if (!this.options.disableMultipart) {
            sendable = new FormData();
            this._onBuildItemForm(item, sendable);
            if (item._file.webkitRelativePath)
                sendable.append('path', item._file.webkitRelativePath);
            _.forEach(item.formData, function (value, key) {
                sendable.append(key, value);
            });
            sendable.append(item.alias, item._file, item.file.name);
        }
        else {
            sendable = item._file;
        }
        xhr.upload.onprogress = function (event) {
            var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
            _this._onProgressItem(item, progress);
        };
        xhr.onload = function () {
            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
            var response = _this._transformResponse(xhr.response, headers);
            var gist = _this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
            var method = '_on' + gist + 'Item';
            _this[method](item, response, xhr.status, headers);
            _this._onCompleteItem(item, response, xhr.status, headers);
        };
        xhr.onerror = function () {
            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
            var response = _this._transformResponse(xhr.response, headers);
            _this._onErrorItem(item, response, xhr.status, headers);
            _this._onCompleteItem(item, response, xhr.status, headers);
        };
        xhr.onabort = function () {
            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
            var response = _this._transformResponse(xhr.response, headers);
            _this._onCancelItem(item, response, xhr.status, headers);
            _this._onCompleteItem(item, response, xhr.status, headers);
        };
        xhr.open(item.method, item.url, true);
        xhr.withCredentials = item.withCredentials;
        if (this.options.headers) {
            for (var _i = 0, _a = this.options.headers; _i < _a.length; _i++) {
                var header = _a[_i];
                xhr.setRequestHeader(header.name, header.value);
            }
        }
        if (this.authToken) {
            xhr.setRequestHeader(this.authTokenHeader, this.authToken);
        }
        xhr.send(sendable);
        this._render();
    };
    FileUploader.prototype._getTotalProgress = function (value) {
        if (value === void 0) { value = 0; }
        if (this.options.removeAfterUpload) {
            return value;
        }
        var notUploaded = this.getNotUploadedItems().length;
        var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
        var ratio = 100 / this.queue.length;
        var current = value * ratio / 100;
        return Math.round(uploaded * ratio + current);
    };
    FileUploader.prototype._getFilters = function (filters) {
        if (!filters) {
            return this.options.filters;
        }
        if (Array.isArray(filters)) {
            return filters;
        }
        if (typeof filters === 'string') {
            var names_1 = filters.match(/[^\s,]+/g);
            return this.options.filters
                .filter(function (filter) { return names_1.indexOf(filter.name) !== -1; });
        }
        return this.options.filters;
    };
    FileUploader.prototype._render = function () {
        return void 0;
    };
    FileUploader.prototype._queueLimitFilter = function () {
        return this.options.queueLimit === undefined || this.queue.length < this.options.queueLimit;
    };
    FileUploader.prototype._isValidFile = function (file, filters, options) {
        var _this = this;
        this._failFilterIndex = -1;
        return !filters.length ? true : filters.every(function (filter) {
            _this._failFilterIndex++;
            return filter.fn.call(_this, file, options);
        });
    };
    FileUploader.prototype._isSuccessCode = function (status) {
        return (status >= 200 && status < 300) || status === 304;
    };
    FileUploader.prototype._transformResponse = function (response, headers) {
        return response;
    };
    FileUploader.prototype._parseHeaders = function (headers) {
        var parsed = {};
        var key;
        var val;
        var i;
        if (!headers) {
            return parsed;
        }
        headers.split('\n').map(function (line) {
            i = line.indexOf(':');
            key = line.slice(0, i).trim().toLowerCase();
            val = line.slice(i + 1).trim();
            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        });
        return parsed;
    };
    FileUploader.prototype._onWhenAddingFileFailed = function (item, filter, options) {
        this.onWhenAddingFileFailed(item, filter, options);
    };
    FileUploader.prototype._onAfterAddingFile = function (item) {
        this.onAfterAddingFile(item);
    };
    FileUploader.prototype._onAfterAddingAll = function (items) {
        this.onAfterAddingAll(items);
    };
    FileUploader.prototype._onBeforeUploadItem = function (item) {
        item._onBeforeUpload();
        this.onBeforeUploadItem(item);
    };
    FileUploader.prototype._onBuildItemForm = function (item, form) {
        item._onBuildForm(form);
        this.onBuildItemForm(item, form);
    };
    FileUploader.prototype._onProgressItem = function (item, progress) {
        var total = this._getTotalProgress(progress);
        this.progress = total;
        item._onProgress(progress);
        this.onProgressItem(item, progress);
        this.onProgressAll(total);
        this._render();
    };
    FileUploader.prototype._onSuccessItem = function (item, response, status, headers) {
        item._onSuccess(response, status, headers);
        this.onSuccessItem(item, response, status, headers);
    };
    FileUploader.prototype._onCancelItem = function (item, response, status, headers) {
        item._onCancel(response, status, headers);
        this.onCancelItem(item, response, status, headers);
    };
    return FileUploader;
}());
exports.FileUploader = FileUploader;
//# sourceMappingURL=file-uploader.class.js.map
});

;require.register("lib/ng2-file-upload/ng2-file-upload.ts", function(exports, require, module) {
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./components/file-upload/file-select.directive'));
__export(require('./components/file-upload/file-drop.directive'));
__export(require('./components/file-upload/file-uploader.class'));
var file_upload_module_1 = require('./components/file-upload/file-upload.module');
exports.FileUploadModule = file_upload_module_1.FileUploadModule;
//# sourceMappingURL=ng2-file-upload.js.map
});

require.register("lib/ng2-page-scroll/ng2-page-scroll-config.ts", function(exports, require, module) {
"use strict";
var EasingLogic = (function () {
    function EasingLogic() {
    }
    return EasingLogic;
}());
exports.EasingLogic = EasingLogic;
var PageScrollConfig = (function () {
    function PageScrollConfig() {
    }
    Object.defineProperty(PageScrollConfig, "defaultEasingLogic", {
        get: function () {
            return PageScrollConfig._easingLogic;
        },
        set: function (easingLogic) {
            PageScrollConfig._easingLogic = easingLogic;
        },
        enumerable: true,
        configurable: true
    });
    PageScrollConfig._interval = 10;
    PageScrollConfig._minScrollDistance = 2;
    PageScrollConfig._defaultNamespace = 'default';
    PageScrollConfig.defaultDuration = 1250;
    PageScrollConfig.defaultScrollOffset = 0;
    PageScrollConfig._interruptEvents = ['mousedown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'keyup', 'touchmove'];
    PageScrollConfig._interruptKeys = [33, 34, 35, 36, 38, 40];
    PageScrollConfig.defaultInterruptible = true;
    PageScrollConfig._easingLogic = {
        ease: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1)
                return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
    };
    return PageScrollConfig;
}());
exports.PageScrollConfig = PageScrollConfig;
//# sourceMappingURL=ng2-page-scroll-config.js.map
});

;require.register("lib/ng2-page-scroll/ng2-page-scroll-instance.ts", function(exports, require, module) {
"use strict";
var core_1 = require('@angular/core');
var ng2_page_scroll_config_1 = require('./ng2-page-scroll-config');
var ng2_page_scroll_util_service_1 = require('./ng2-page-scroll-util.service');
var PageScrollInstance = (function () {
    function PageScrollInstance(namespace, document) {
        this._namespace = ng2_page_scroll_config_1.PageScrollConfig._defaultNamespace;
        this._offset = ng2_page_scroll_config_1.PageScrollConfig.defaultScrollOffset;
        this._duration = ng2_page_scroll_config_1.PageScrollConfig.defaultDuration;
        this._easingLogic = ng2_page_scroll_config_1.PageScrollConfig.defaultEasingLogic;
        this._interruptible = ng2_page_scroll_config_1.PageScrollConfig.defaultInterruptible;
        this._pageScrollFinish = new core_1.EventEmitter();
        this._startScrollTop = 0;
        this._interruptListenersAttached = false;
        this._timer = null;
        this._namespace = namespace;
        this.document = document;
    }
    PageScrollInstance.simpleInstance = function (document, scrollTarget, namespace) {
        return PageScrollInstance.advancedInstance(document, scrollTarget, null, namespace, null, null, null, null);
    };
    PageScrollInstance.simpleInlineInstance = function (document, scrollTarget, scrollingView, namespace) {
        return PageScrollInstance.advancedInstance(document, scrollTarget, [scrollingView], namespace, null, null, null, null);
    };
    PageScrollInstance.advancedInstance = function (document, scrollTarget, scrollingViews, namespace, pageScrollOffset, pageScrollInterruptible, pageScrollEasingLogic, pageScrollDuration, pageScrollFinishListener) {
        if (scrollingViews === void 0) { scrollingViews = null; }
        if (pageScrollOffset === void 0) { pageScrollOffset = null; }
        if (pageScrollInterruptible === void 0) { pageScrollInterruptible = null; }
        if (pageScrollEasingLogic === void 0) { pageScrollEasingLogic = null; }
        if (pageScrollDuration === void 0) { pageScrollDuration = null; }
        if (pageScrollFinishListener === void 0) { pageScrollFinishListener = null; }
        if (ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(namespace) || namespace.length <= 0) {
            namespace = ng2_page_scroll_config_1.PageScrollConfig._defaultNamespace;
        }
        var pageScrollInstance = new PageScrollInstance(namespace, document);
        if (ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(scrollingViews) || scrollingViews.length === 0) {
            pageScrollInstance._isInlineScrolling = false;
            pageScrollInstance._scrollTopSources = [document.documentElement, document.body, document.body.parentNode];
        }
        else {
            pageScrollInstance._isInlineScrolling = true;
            pageScrollInstance._scrollTopSources = scrollingViews;
        }
        pageScrollInstance._scrollTarget = scrollTarget;
        if (!ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(pageScrollOffset)) {
            pageScrollInstance._offset = pageScrollOffset;
        }
        if (!ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(pageScrollEasingLogic)) {
            pageScrollInstance._easingLogic = pageScrollEasingLogic;
        }
        if (!ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(pageScrollDuration)) {
            pageScrollInstance._duration = pageScrollDuration;
        }
        if (!ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(pageScrollFinishListener)) {
            pageScrollInstance._pageScrollFinish = pageScrollFinishListener;
        }
        pageScrollInstance._interruptible = pageScrollInterruptible ||
            (ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(pageScrollInterruptible) && ng2_page_scroll_config_1.PageScrollConfig.defaultInterruptible);
        return pageScrollInstance;
    };
    PageScrollInstance.prototype.extractScrollTargetPosition = function () {
        var scrollTargetElement;
        if (typeof this._scrollTarget === 'string') {
            scrollTargetElement = this.document.getElementById(this._scrollTarget.substr(1));
        }
        else {
            scrollTargetElement = this._scrollTarget;
        }
        if (scrollTargetElement === null || scrollTargetElement === undefined) {
            return { top: NaN, left: NaN };
        }
        if (this._isInlineScrolling) {
            return { top: scrollTargetElement.offsetTop, left: scrollTargetElement.offsetLeft };
        }
        return ng2_page_scroll_util_service_1.PageScrollUtilService.extractElementPosition(this.document, scrollTargetElement);
    };
    PageScrollInstance.prototype.getCurrentOffset = function () {
        return this._offset;
    };
    PageScrollInstance.prototype.setScrollTopPosition = function (position) {
        return this.scrollTopSources.reduce(function (oneAlreadyWorked, scrollTopSource) {
            if (scrollTopSource && !ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(scrollTopSource.scrollTop)) {
                var scrollDistance = Math.abs(scrollTopSource.scrollTop - position);
                var isSmallMovement = scrollDistance < ng2_page_scroll_config_1.PageScrollConfig._minScrollDistance;
                scrollTopSource.scrollTop = position;
                if (isSmallMovement || scrollDistance > Math.abs(scrollTopSource.scrollTop - position)) {
                    return true;
                }
            }
            return oneAlreadyWorked;
        }, false);
    };
    PageScrollInstance.prototype.fireEvent = function (value) {
        if (this._pageScrollFinish) {
            this._pageScrollFinish.emit(value);
        }
    };
    PageScrollInstance.prototype.attachInterruptListeners = function (interruptReporter) {
        var _this = this;
        if (this._interruptListenersAttached) {
            this.detachInterruptListeners();
        }
        this._interruptListener = function (event) {
            interruptReporter.report(event, _this);
        };
        ng2_page_scroll_config_1.PageScrollConfig._interruptEvents.forEach(function (event) { return _this.document.body.addEventListener(event, _this._interruptListener); });
        this._interruptListenersAttached = true;
    };
    PageScrollInstance.prototype.detachInterruptListeners = function () {
        var _this = this;
        ng2_page_scroll_config_1.PageScrollConfig._interruptEvents.forEach(function (event) { return _this.document.body.removeEventListener(event, _this._interruptListener); });
        this._interruptListenersAttached = false;
    };
    Object.defineProperty(PageScrollInstance.prototype, "namespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "scrollTopSources", {
        get: function () {
            return this._scrollTopSources;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "startScrollTop", {
        get: function () {
            return this._startScrollTop;
        },
        set: function (value) {
            this._startScrollTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "targetScrollTop", {
        get: function () {
            return this._targetScrollTop;
        },
        set: function (value) {
            this._targetScrollTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "distanceToScroll", {
        get: function () {
            return this._distanceToScroll;
        },
        set: function (value) {
            this._distanceToScroll = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "easingLogic", {
        get: function () {
            return this._easingLogic;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "interruptible", {
        get: function () {
            return this._interruptible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "endTime", {
        get: function () {
            return this._endTime;
        },
        set: function (value) {
            this._endTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "timer", {
        get: function () {
            return this._timer;
        },
        set: function (value) {
            this._timer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageScrollInstance.prototype, "interruptListenersAttached", {
        get: function () {
            return this._interruptListenersAttached;
        },
        enumerable: true,
        configurable: true
    });
    return PageScrollInstance;
}());
exports.PageScrollInstance = PageScrollInstance;
//# sourceMappingURL=ng2-page-scroll-instance.js.map
});

;require.register("lib/ng2-page-scroll/ng2-page-scroll-util.service.ts", function(exports, require, module) {
"use strict";
var PageScrollUtilService = (function () {
    function PageScrollUtilService() {
    }
    PageScrollUtilService.isUndefinedOrNull = function (variable) {
        return (typeof variable === 'undefined') || variable === undefined || variable === null;
    };
    PageScrollUtilService.extractElementPosition = function (document, scrollTargetElement) {
        var body = document.body;
        var docEl = document.documentElement;
        var windowPageYOffset = document.defaultView && document.defaultView.pageYOffset || undefined;
        var windowPageXOffset = document.defaultView && document.defaultView.pageXOffset || undefined;
        var scrollTop = windowPageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = windowPageXOffset || docEl.scrollLeft || body.scrollLeft;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
        if (PageScrollUtilService.isUndefinedOrNull(scrollTargetElement)) {
            return { top: scrollTop, left: scrollLeft };
        }
        var box = scrollTargetElement.getBoundingClientRect();
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    };
    return PageScrollUtilService;
}());
exports.PageScrollUtilService = PageScrollUtilService;
//# sourceMappingURL=ng2-page-scroll-util.service.js.map
});

;require.register("lib/ng2-page-scroll/ng2-page-scroll.directive.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var platform_browser_1 = require('@angular/platform-browser');
var ng2_page_scroll_service_1 = require('./ng2-page-scroll.service');
var ng2_page_scroll_instance_1 = require('./ng2-page-scroll-instance');
var ng2_page_scroll_util_service_1 = require('./ng2-page-scroll-util.service');
var ng2_page_scroll_config_1 = require('./ng2-page-scroll-config');
var PageScroll = (function () {
    function PageScroll(pageScrollService, router, document) {
        this.pageScrollService = pageScrollService;
        this.router = router;
        this.pageScrollOffset = null;
        this.pageScrollDuration = null;
        this.pageScrollEasing = null;
        this.pageScroll = null;
        this.pageScrollFinish = new core_1.EventEmitter();
        this.document = document;
    }
    PageScroll.prototype.ngOnDestroy = function () {
        if (this.pageScrollInstance) {
            this.pageScrollService.stop(this.pageScrollInstance);
        }
        return undefined;
    };
    PageScroll.prototype.generatePageScrollInstance = function () {
        if (ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(this.pageScrollInstance)) {
            this.pageScrollInstance = ng2_page_scroll_instance_1.PageScrollInstance.advancedInstance(this.document, this.href, null, this.pageScroll, this.pageScrollOffset, this.pageScrollInterruptible, this.pageScrollEasing, this.pageScrollDuration, this.pageScrollFinish);
        }
        return this.pageScrollInstance;
    };
    PageScroll.prototype.handleClick = function (clickEvent) {
        var _this = this;
        if (this.routerLink && this.router !== null && this.router !== undefined) {
            var subscription_1 = this.router.events.subscribe(function (routerEvent) {
                if (routerEvent instanceof router_1.NavigationEnd) {
                    subscription_1.unsubscribe();
                    _this.pageScrollService.start(_this.generatePageScrollInstance());
                }
                else if (routerEvent instanceof router_1.NavigationError || routerEvent instanceof router_1.NavigationCancel) {
                    subscription_1.unsubscribe();
                }
            });
        }
        else {
            this.pageScrollService.start(this.generatePageScrollInstance());
        }
        return false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PageScroll.prototype, "routerLink", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PageScroll.prototype, "href", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PageScroll.prototype, "pageScrollOffset", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PageScroll.prototype, "pageScrollDuration", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof ng2_page_scroll_config_1.EasingLogic !== 'undefined' && ng2_page_scroll_config_1.EasingLogic) === 'function' && _a) || Object)
    ], PageScroll.prototype, "pageScrollEasing", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PageScroll.prototype, "pageScrollInterruptible", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PageScroll.prototype, "pageScroll", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], PageScroll.prototype, "pageScrollFinish", void 0);
    PageScroll = __decorate([
        core_1.Directive({
            selector: '[pageScroll]',
            host: {
                '(click)': 'handleClick($event)',
            }
        }),
        __param(1, core_1.Optional()),
        __param(2, core_1.Inject(platform_browser_1.DOCUMENT)), 
        __metadata('design:paramtypes', [(typeof (_c = typeof ng2_page_scroll_service_1.PageScrollService !== 'undefined' && ng2_page_scroll_service_1.PageScrollService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _d) || Object, Object])
    ], PageScroll);
    return PageScroll;
    var _a, _b, _c, _d;
}());
exports.PageScroll = PageScroll;
//# sourceMappingURL=ng2-page-scroll.directive.js.map
});

;require.register("lib/ng2-page-scroll/ng2-page-scroll.module.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var common_1 = require('@angular/common');
var core_1 = require('@angular/core');
var ng2_page_scroll_service_1 = require('./ng2-page-scroll.service');
var ng2_page_scroll_directive_1 = require('./ng2-page-scroll.directive');
var Ng2PageScrollModule = (function () {
    function Ng2PageScrollModule() {
    }
    Ng2PageScrollModule.forRoot = function () {
        return {
            ngModule: Ng2PageScrollModule,
            providers: [
                { provide: ng2_page_scroll_service_1.PageScrollService, useClass: ng2_page_scroll_service_1.PageScrollService }
            ]
        };
    };
    Ng2PageScrollModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [ng2_page_scroll_directive_1.PageScroll],
            exports: [ng2_page_scroll_directive_1.PageScroll]
        }), 
        __metadata('design:paramtypes', [])
    ], Ng2PageScrollModule);
    return Ng2PageScrollModule;
}());
exports.Ng2PageScrollModule = Ng2PageScrollModule;
//# sourceMappingURL=ng2-page-scroll.module.js.map
});

;require.register("lib/ng2-page-scroll/ng2-page-scroll.service.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ng2_page_scroll_config_1 = require('./ng2-page-scroll-config');
var ng2_page_scroll_util_service_1 = require('./ng2-page-scroll-util.service');
var PageScrollService = (function () {
    function PageScrollService() {
        var _this = this;
        this.runningInstances = [];
        this.onInterrupted = {
            report: function (event, pageScrollInstance) {
                if (pageScrollInstance.interruptible &&
                    (event.type !== 'keyup' || ng2_page_scroll_config_1.PageScrollConfig._interruptKeys.indexOf(event.keyCode) >= 0)) {
                    _this.stopAll(pageScrollInstance.namespace);
                }
            }
        };
        if (PageScrollService.instanceCounter > 0 && core_1.isDevMode()) {
            console.warn('An instance of PageScrollService already exists, usually ' +
                'including one provider should be enough, so double check.');
        }
        PageScrollService.instanceCounter++;
    }
    PageScrollService.prototype.stopInternal = function (interrupted, pageScrollInstance) {
        var index = this.runningInstances.indexOf(pageScrollInstance);
        if (index >= 0) {
            this.runningInstances.splice(index, 1);
        }
        if (pageScrollInstance.interruptListenersAttached) {
            pageScrollInstance.detachInterruptListeners();
        }
        if (pageScrollInstance.timer) {
            clearInterval(pageScrollInstance.timer);
            pageScrollInstance.timer = undefined;
            pageScrollInstance.fireEvent(!interrupted);
            return true;
        }
        return false;
    };
    PageScrollService.prototype.start = function (pageScrollInstance) {
        var _this = this;
        this.stopAll(pageScrollInstance.namespace);
        if (pageScrollInstance.scrollTopSources === null || pageScrollInstance.scrollTopSources.length === 0) {
            if (core_1.isDevMode()) {
                console.warn('No ScrollTopSource specified, this ng2-page-scroll does not know which DOM elements to scroll');
            }
            return;
        }
        var startScrollTopFound = false;
        pageScrollInstance.scrollTopSources.forEach(function (scrollingView) {
            if (ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(scrollingView)) {
                return;
            }
            if (!startScrollTopFound && scrollingView.scrollTop) {
                pageScrollInstance.startScrollTop = scrollingView.scrollTop;
                startScrollTopFound = true;
            }
        });
        var pageScrollOffset = pageScrollInstance.getCurrentOffset();
        pageScrollInstance.targetScrollTop = Math.round(pageScrollInstance.extractScrollTargetPosition().top - pageScrollOffset);
        pageScrollInstance.distanceToScroll = pageScrollInstance.targetScrollTop - pageScrollInstance.startScrollTop;
        if (isNaN(pageScrollInstance.distanceToScroll)) {
            if (core_1.isDevMode()) {
                console.log('Scrolling not possible, as we can\'t find the specified target');
            }
            pageScrollInstance.fireEvent(false);
            return;
        }
        var allReadyAtDestination = Math.abs(pageScrollInstance.distanceToScroll) < ng2_page_scroll_config_1.PageScrollConfig._minScrollDistance;
        var tooShortInterval = pageScrollInstance.duration <= ng2_page_scroll_config_1.PageScrollConfig._interval;
        if (allReadyAtDestination || tooShortInterval) {
            if (core_1.isDevMode()) {
                if (allReadyAtDestination) {
                    console.log('Scrolling not possible, as we can\'t get any closer to the destination');
                }
                else {
                    console.log('Scroll duration shorter that interval length, jumping to target');
                }
            }
            pageScrollInstance.setScrollTopPosition(pageScrollInstance.targetScrollTop);
            pageScrollInstance.fireEvent(true);
            return;
        }
        if (pageScrollInstance.interruptible ||
            (ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(pageScrollInstance.interruptible) && ng2_page_scroll_config_1.PageScrollConfig.defaultInterruptible)) {
            pageScrollInstance.attachInterruptListeners(this.onInterrupted);
        }
        pageScrollInstance.startTime = new Date().getTime();
        pageScrollInstance.endTime = pageScrollInstance.startTime + pageScrollInstance.duration;
        pageScrollInstance.timer = setInterval(function (_pageScrollInstance) {
            var currentTime = new Date().getTime();
            var newScrollTop;
            var stopNow = false;
            if (_pageScrollInstance.endTime <= currentTime) {
                newScrollTop = _pageScrollInstance.targetScrollTop;
                stopNow = true;
            }
            else {
                newScrollTop = Math.round(_pageScrollInstance.easingLogic.ease(currentTime - _pageScrollInstance.startTime, _pageScrollInstance.startScrollTop, _pageScrollInstance.distanceToScroll, _pageScrollInstance.duration));
            }
            if (!_pageScrollInstance.setScrollTopPosition(newScrollTop)) {
                stopNow = true;
            }
            if (stopNow) {
                _this.stopInternal(false, _pageScrollInstance);
            }
        }, ng2_page_scroll_config_1.PageScrollConfig._interval, pageScrollInstance);
        this.runningInstances.push(pageScrollInstance);
    };
    PageScrollService.prototype.stopAll = function (namespace) {
        var _this = this;
        if (this.runningInstances.length > 0) {
            var stoppedSome_1 = false;
            this.runningInstances.forEach(function (pageScrollInstance, index) {
                if (ng2_page_scroll_util_service_1.PageScrollUtilService.isUndefinedOrNull(namespace) || namespace.length === 0 ||
                    pageScrollInstance.namespace === namespace) {
                    stoppedSome_1 = true;
                    _this.stopInternal(true, pageScrollInstance);
                }
            });
            return stoppedSome_1;
        }
        return false;
    };
    PageScrollService.prototype.stop = function (pageScrollInstance) {
        return this.stopInternal(true, pageScrollInstance);
    };
    PageScrollService.instanceCounter = 0;
    PageScrollService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], PageScrollService);
    return PageScrollService;
}());
exports.PageScrollService = PageScrollService;
//# sourceMappingURL=ng2-page-scroll.service.js.map
});

;require.register("lib/vex/dialog-form-modal.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var angular2_modal_1 = require('angular2-modal');
var VEXDialogButtons = (function () {
    function VEXDialogButtons() {
        this.onButtonClick = new core_1.EventEmitter();
    }
    VEXDialogButtons.prototype.onClick = function (btn, $event) {
        $event.stopPropagation();
        this.onButtonClick.emit({ btn: btn, $event: $event });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], VEXDialogButtons.prototype, "buttons", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], VEXDialogButtons.prototype, "onButtonClick", void 0);
    VEXDialogButtons = __decorate([
        core_1.Component({
            selector: 'vex-dialog-buttons',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div class=\"vex-dialog-buttons\">\n    <button type=\"button\" \n         *ngFor=\"let btn of buttons;\"\n         [class]=\"btn.cssClass\"\n         (click)=\"onClick(btn, $event)\">{{btn.caption}}</button>\n</div>"
        }), 
        __metadata('design:paramtypes', [])
    ], VEXDialogButtons);
    return VEXDialogButtons;
}());
exports.VEXDialogButtons = VEXDialogButtons;
var DialogFormModal = (function () {
    function DialogFormModal(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    DialogFormModal.prototype.onButtonClick = function ($event) {
        $event.btn.onClick(this, $event.$event);
    };
    DialogFormModal = __decorate([
        core_1.Component({
            selector: 'modal-dialog',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<form class=\"vex-dialog-form\">\n    <template [swapCmp]=\"context.content\"></template>\n    <vex-dialog-buttons [buttons]=\"context.buttons\"\n                        (onButtonClick)=\"onButtonClick($event)\"></vex-dialog-buttons>\n</form>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], DialogFormModal);
    return DialogFormModal;
    var _a;
}());
exports.DialogFormModal = DialogFormModal;
var FormDropIn = (function () {
    function FormDropIn(dialog) {
        this.dialog = dialog;
        this.context = dialog.context;
    }
    FormDropIn = __decorate([
        core_1.Component({
            selector: 'drop-in-dialog',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "<div class=\"vex-dialog-message\">{{context.message}}</div>\n <div *ngIf=\"context.showInput\" class=\"vex-dialog-input\">\n   <input #input\n          autofocus\n          name=\"vex\" \n          type=\"text\" \n          class=\"vex-dialog-prompt-input\"\n           (change)=\"context.defaultResult = input.value\" \n          placeholder=\"{{context.placeholder}}\">\n </div>\n <div *ngIf=\"context.showCloseButton\" \n      [class]=\"context.closeClassName\"\n      (click)=\"dialog.dismiss()\"></div>"
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.DialogRef !== 'undefined' && angular2_modal_1.DialogRef) === 'function' && _a) || Object])
    ], FormDropIn);
    return FormDropIn;
    var _a;
}());
exports.FormDropIn = FormDropIn;
//# sourceMappingURL=dialog-form-modal.js.map
});

;require.register("lib/vex/index.ts", function(exports, require, module) {
"use strict";
var modal_1 = require('./modal');
exports.Modal = modal_1.Modal;
var modal_context_1 = require('./modal-context');
exports.VEXBuiltInThemes = modal_context_1.VEXBuiltInThemes;
exports.VEXModalContext = modal_context_1.VEXModalContext;
exports.VEXModalContextBuilder = modal_context_1.VEXModalContextBuilder;
var dropin_preset_1 = require('./presets/dropin-preset');
exports.DropInPreset = dropin_preset_1.DropInPreset;
exports.DropInPresetBuilder = dropin_preset_1.DropInPresetBuilder;
var dialog_form_modal_1 = require('./dialog-form-modal');
exports.DialogFormModal = dialog_form_modal_1.DialogFormModal;
exports.FormDropIn = dialog_form_modal_1.FormDropIn;
exports.VEXButtonClickEvent = dialog_form_modal_1.VEXButtonClickEvent;
exports.VEXButtonConfig = dialog_form_modal_1.VEXButtonConfig;
exports.VEXButtonHandler = dialog_form_modal_1.VEXButtonHandler;
exports.VEXDialogButtons = dialog_form_modal_1.VEXDialogButtons;
var dialog_preset_1 = require('./presets/dialog-preset');
exports.DialogPreset = dialog_preset_1.DialogPreset;
exports.DialogPresetBuilder = dialog_preset_1.DialogPresetBuilder;
var vex_module_1 = require('./vex.module');
exports.VexModalModule = vex_module_1.VexModalModule;
//# sourceMappingURL=index.js.map
});

require.register("lib/vex/modal-context.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var angular2_modal_1 = require('angular2-modal');
var DEFAULT_VALUES = {
    className: 'default',
    overlayClassName: 'vex-overlay',
    contentClassName: 'vex-content',
    closeClassName: 'vex-close'
};
var DEFAULT_SETTERS = [
    'className',
    'overlayClassName',
    'contentClassName',
    'closeClassName',
    'showCloseButton'
];
var VEXModalContext = (function (_super) {
    __extends(VEXModalContext, _super);
    function VEXModalContext() {
        _super.apply(this, arguments);
    }
    VEXModalContext.prototype.normalize = function () {
        if (!this.className) {
            this.className = DEFAULT_VALUES.className;
        }
        if (!this.overlayClassName) {
            this.overlayClassName = DEFAULT_VALUES.overlayClassName;
        }
        if (!this.contentClassName) {
            this.contentClassName = DEFAULT_VALUES.contentClassName;
        }
        if (!this.closeClassName) {
            this.closeClassName = DEFAULT_VALUES.closeClassName;
        }
        _super.prototype.normalize.call(this);
    };
    return VEXModalContext;
}(angular2_modal_1.ModalOpenContext));
exports.VEXModalContext = VEXModalContext;
var VEXModalContextBuilder = (function (_super) {
    __extends(VEXModalContextBuilder, _super);
    function VEXModalContextBuilder(defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, angular2_modal_1.extend(DEFAULT_VALUES, defaultValues || {}), angular2_modal_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || VEXModalContext);
    }
    VEXModalContextBuilder.prototype.overlayClosesOnClick = function (value) {
        this[angular2_modal_1.privateKey('isBlocking')] = !value;
        return this;
    };
    return VEXModalContextBuilder;
}(angular2_modal_1.ModalOpenContextBuilder));
exports.VEXModalContextBuilder = VEXModalContextBuilder;
//# sourceMappingURL=modal-context.js.map
});

;require.register("lib/vex/modal.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require('rxjs/add/operator/first');
var core_1 = require('@angular/core');
var angular2_modal_1 = require('angular2-modal');
var dropin_preset_1 = require('./presets/dropin-preset');
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(overlay) {
        _super.call(this, overlay);
    }
    Modal.prototype.alert = function () {
        return new dropin_preset_1.DropInPresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.alert, { isBlocking: false });
    };
    Modal.prototype.prompt = function () {
        return new dropin_preset_1.DropInPresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.prompt, {
            isBlocking: true,
            keyboard: null
        });
    };
    Modal.prototype.confirm = function () {
        return new dropin_preset_1.DropInPresetBuilder(this, angular2_modal_1.DROP_IN_TYPE.confirm, {
            isBlocking: true,
            keyboard: null
        });
    };
    Modal.prototype.create = function (dialogRef, content, bindings) {
        var _this = this;
        var backdropRef = this.createBackdrop(dialogRef, angular2_modal_1.CSSBackdrop);
        var containerRef = this.createContainer(dialogRef, angular2_modal_1.CSSDialogContainer, content, bindings);
        var overlay = dialogRef.overlayRef.instance;
        var backdrop = backdropRef.instance;
        var container = containerRef.instance;
        dialogRef.inElement ? overlay.insideElement() : overlay.fullscreen();
        if (!document.body.classList.contains('vex-open')) {
            document.body.classList.add('vex-open');
        }
        overlay.addClass("vex vex-theme-" + dialogRef.context.className);
        backdrop.addClass('vex-overlay');
        container.addClass(dialogRef.context.contentClassName);
        container.setStyle('display', 'block');
        if (dialogRef.inElement) {
            overlay.setStyle('padding', '0');
            container.setStyle('margin-top', '20px');
        }
        if (containerRef.location.nativeElement) {
            containerRef.location.nativeElement.focus();
        }
        if (dialogRef.context.className === 'bottom-right-corner') {
            overlay.setStyle('overflow-y', 'hidden');
            container.setStyle('position', 'absolute');
        }
        overlay.beforeDestroy(function () {
            overlay.addClass('vex-closing');
            var completer = new angular2_modal_1.PromiseCompleter();
            var animationEnd$ = container.myAnimationEnd$();
            if (dialogRef.context.className !== 'bottom-right-corner') {
                animationEnd$ = animationEnd$.combineLatest(backdrop.myAnimationEnd$(), function (s1, s2) { return [s1, s2]; });
            }
            animationEnd$.subscribe(function (sources) {
                _this.overlay.groupStackLength(dialogRef) === 1 && document.body.classList.remove('vex-open');
                completer.resolve();
            });
            return completer.promise;
        });
        overlay.setClickBoundary(containerRef.location.nativeElement);
        return dialogRef;
    };
    Modal = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof angular2_modal_1.Overlay !== 'undefined' && angular2_modal_1.Overlay) === 'function' && _a) || Object])
    ], Modal);
    return Modal;
    var _a;
}(angular2_modal_1.Modal));
exports.Modal = Modal;
//# sourceMappingURL=modal.js.map
});

;require.register("lib/vex/presets/dialog-preset.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var angular2_modal_1 = require('angular2-modal');
var modal_context_1 = require('../modal-context');
var dialog_form_modal_1 = require('../dialog-form-modal');
var DEFAULT_SETTERS = [
    'content'
];
var DialogPreset = (function (_super) {
    __extends(DialogPreset, _super);
    function DialogPreset() {
        _super.apply(this, arguments);
    }
    return DialogPreset;
}(modal_context_1.VEXModalContext));
exports.DialogPreset = DialogPreset;
var DialogPresetBuilder = (function (_super) {
    __extends(DialogPresetBuilder, _super);
    function DialogPresetBuilder(modal, defaultValues, initialSetters, baseType) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        if (initialSetters === void 0) { initialSetters = undefined; }
        if (baseType === void 0) { baseType = undefined; }
        _super.call(this, angular2_modal_1.extend({ modal: modal, component: dialog_form_modal_1.DialogFormModal, buttons: [], defaultResult: true }, defaultValues || {}), angular2_modal_1.arrayUnion(DEFAULT_SETTERS, initialSetters || []), baseType || DialogPreset);
    }
    DialogPresetBuilder.prototype.addButton = function (css, caption, onClick) {
        var btn = {
            cssClass: css,
            caption: caption,
            onClick: onClick
        };
        var key = angular2_modal_1.privateKey('buttons');
        this[key].push(btn);
        return this;
    };
    DialogPresetBuilder.prototype.addOkButton = function (text) {
        if (text === void 0) { text = 'OK'; }
        this.addButton('vex-dialog-button-primary vex-dialog-button vex-first', text, function (cmp, $event) { return cmp.dialog.close(cmp.dialog.context.defaultResult); });
        return this;
    };
    DialogPresetBuilder.prototype.addCancelButton = function (text) {
        if (text === void 0) { text = 'CANCEL'; }
        this.addButton('vex-dialog-button-secondary vex-dialog-button vex-last', text, function (cmp, $event) { return cmp.dialog.dismiss(); });
        return this;
    };
    return DialogPresetBuilder;
}(modal_context_1.VEXModalContextBuilder));
exports.DialogPresetBuilder = DialogPresetBuilder;
//# sourceMappingURL=dialog-preset.js.map
});

;require.register("lib/vex/presets/dropin-preset.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var angular2_modal_1 = require('angular2-modal');
var dialog_form_modal_1 = require('../dialog-form-modal');
var dialog_preset_1 = require('./dialog-preset');
var DEFAULT_VALUES = {
    component: dialog_form_modal_1.DialogFormModal,
    content: dialog_form_modal_1.FormDropIn,
    okBtn: 'OK',
    cancelBtn: 'Cancel'
};
var DEFAULT_SETTERS = [
    'okBtn',
    'cancelBtn',
    'placeholder'
];
var DropInPreset = (function (_super) {
    __extends(DropInPreset, _super);
    function DropInPreset() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(DropInPreset.prototype, "showInput", {
        get: function () {
            return this.dropInType === angular2_modal_1.DROP_IN_TYPE.prompt;
        },
        enumerable: true,
        configurable: true
    });
    return DropInPreset;
}(dialog_preset_1.DialogPreset));
exports.DropInPreset = DropInPreset;
var DropInPresetBuilder = (function (_super) {
    __extends(DropInPresetBuilder, _super);
    function DropInPresetBuilder(modal, dropInType, defaultValues) {
        if (defaultValues === void 0) { defaultValues = undefined; }
        _super.call(this, modal, angular2_modal_1.extend(angular2_modal_1.extend({ modal: modal, dropInType: dropInType }, DEFAULT_VALUES), defaultValues || {}), DEFAULT_SETTERS, DropInPreset);
    }
    DropInPresetBuilder.prototype.$$beforeOpen = function (config) {
        if (config.okBtn) {
            this.addOkButton(config.okBtn);
        }
        switch (config.dropInType) {
            case angular2_modal_1.DROP_IN_TYPE.prompt:
                config.defaultResult = undefined;
            case angular2_modal_1.DROP_IN_TYPE.confirm:
                if (config.cancelBtn) {
                    this.addCancelButton(config.cancelBtn);
                }
                break;
        }
        return _super.prototype.$$beforeOpen.call(this, config);
    };
    return DropInPresetBuilder;
}(dialog_preset_1.DialogPresetBuilder));
exports.DropInPresetBuilder = DropInPresetBuilder;
//# sourceMappingURL=dropin-preset.js.map
});

;require.register("lib/vex/vex.module.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var angular2_modal_1 = require('angular2-modal');
var modal_1 = require('./modal');
var dialog_form_modal_1 = require('./dialog-form-modal');
function getProviders() {
    return [
        { provide: angular2_modal_1.Modal, useClass: modal_1.Modal },
        { provide: modal_1.Modal, useClass: modal_1.Modal }
    ];
}
var VexModalModule = (function () {
    function VexModalModule() {
    }
    VexModalModule.getProviders = function () {
        return getProviders();
    };
    VexModalModule = __decorate([
        core_1.NgModule({
            imports: [angular2_modal_1.ModalModule, common_1.CommonModule],
            declarations: [
                dialog_form_modal_1.VEXDialogButtons,
                dialog_form_modal_1.FormDropIn,
                dialog_form_modal_1.DialogFormModal
            ],
            providers: getProviders(),
            entryComponents: [
                dialog_form_modal_1.DialogFormModal,
                dialog_form_modal_1.FormDropIn
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], VexModalModule);
    return VexModalModule;
}());
exports.VexModalModule = VexModalModule;
//# sourceMappingURL=vex.module.js.map
});

;require.register("main.ts", function(exports, require, module) {
"use strict";
require('./vendor');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_module_1 = require('./app.module');
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=main.js.map
});

require.register("services/auth.service.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var app_config_1 = require("../app.config");
var _ = require('lodash');
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.serverUrl = app_config_1.config.serverUrl;
        this.defaultOption = { withCredentials: true };
    }
    AuthService.prototype.checkEmail = function (email) {
        var url = this.serverUrl + '/checkEmail';
        var params = new http_1.URLSearchParams();
        params.set("email", email);
        return this.http
            .get(url, _.assign({ search: params }, this.defaultOption))
            .map(function (response) { return response.json(); });
    };
    AuthService.prototype.checkUsername = function (username) {
        var url = this.serverUrl + '/checkUsername';
        var params = new http_1.URLSearchParams();
        params.set("username", username);
        return this.http
            .get(url, _.assign({ search: params }, this.defaultOption))
            .map(function (response) { return response.json(); });
    };
    AuthService.prototype.checkNickname = function (nickname) {
        var url = this.serverUrl + '/checkNickname';
        var params = new http_1.URLSearchParams();
        params.set("nickname", nickname);
        return this.http
            .get(url, _.assign({ search: params }, this.defaultOption))
            .map(function (response) { return response.json(); });
    };
    AuthService.prototype.login = function (identifier, password) {
        var url = this.serverUrl + '/login';
        return this.http
            .post(url, { identifier: identifier, password: password }, this.defaultOption)
            .map(function (response) { return response.json(); });
    };
    AuthService.prototype.logout = function (queryParams) {
        var url = this.serverUrl + '/logout';
        return this.http
            .get(url, this.defaultOption)
            .map(function (response) { return response.json(); });
    };
    AuthService.prototype.oauth = function (provider) {
        var url = this.serverUrl + '/auth/' + provider;
        window.location.href = url;
    };
    AuthService.prototype.getMyUserInfo = function (queryParams) {
        var url = this.serverUrl + '/me';
        var params = new http_1.URLSearchParams();
        _.forEach(queryParams, function (value, key) {
            params.set(key, JSON.stringify(value));
        });
        return this.http
            .get(url, { search: params, withCredentials: true })
            .map(function (response) { return response.json(); });
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], AuthService);
    return AuthService;
    var _a;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
});

;require.register("services/mock-data.service.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var MockDataService = (function () {
    function MockDataService(http) {
        this.http = http;
    }
    MockDataService.prototype.getMockData = function (query) {
        return new Promise(function (resolve) {
            var req = new XMLHttpRequest();
            req.open('GET', "data/100k.json");
            req.onload = function () {
                var list = JSON.parse(req.response);
                var res = {
                    count: list.length,
                    list: list.splice(query.query.skip, query.query.limit)
                };
                resolve(res);
            };
            req.send();
        });
    };
    MockDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], MockDataService);
    return MockDataService;
    var _a;
}());
exports.MockDataService = MockDataService;
//# sourceMappingURL=mock-data.service.js.map
});

;require.register("services/modal.service.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var vex_1 = require("../lib/vex");
var app_config_1 = require("../app.config");
var ModalService = (function () {
    function ModalService(modal) {
        this.modal = modal;
    }
    ModalService.prototype.alert = function () {
        return this.modal.alert()
            .className(app_config_1.config.modalTheme);
    };
    ;
    ModalService.prototype.prompt = function () {
        return this.modal.prompt()
            .className(app_config_1.config.modalTheme);
    };
    ;
    ModalService.prototype.confirm = function () {
        return this.modal.confirm()
            .className(app_config_1.config.modalTheme);
    };
    ;
    ModalService.prototype.open = function (content, config) {
        return this.modal.open(content, config);
    };
    ;
    ModalService.prototype.getDialogPresetBuilder = function () {
        return new vex_1.DialogPresetBuilder(this.modal)
            .className(app_config_1.config.modalTheme);
    };
    ;
    ModalService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof vex_1.Modal !== 'undefined' && vex_1.Modal) === 'function' && _a) || Object])
    ], ModalService);
    return ModalService;
    var _a;
}());
exports.ModalService = ModalService;
//# sourceMappingURL=modal.service.js.map
});

;require.register("services/stat.service.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var _ = require("lodash");
var rxjs_1 = require("rxjs");
var StatsService = (function () {
    function StatsService(http) {
        var _this = this;
        this.http = http;
        this.timestamp = new Date();
        this.initDataSet = [];
        this.max = 10;
        this.min = 0;
        this.dataSetCount = 10;
        this.dataSetLength = 50;
        _.times(this.dataSetCount, function (i) {
            _this.initDataSet.push([]);
            _.times(_this.dataSetLength, function (j) {
                var max = _this.max + ((_this.dataSetCount - i) * 200);
                _this.initDataSet[i].push({
                    "date": new Date(_this.timestamp.getTime() + (j * 1000)),
                    "count": Math.floor(Math.random() * (max - _this.min)) + _this.min
                });
            });
        });
        this.dataSource = rxjs_1.Observable.interval(1000).map(function () {
            _.times(_this.dataSetCount, function (i) {
                var lastElement = _this.initDataSet[i][_this.initDataSet[i].length - 1];
                var nextTime = lastElement.date.getTime() + 1000;
                var max = _this.max + ((_this.dataSetCount - i) * 200);
                _this.initDataSet[i].push({
                    "date": new Date(nextTime),
                    "count": Math.floor(Math.random() * (max - _this.min)) + _this.min
                });
                _this.initDataSet[i].splice(0, 1);
            });
            return _this.initDataSet;
        });
    }
    StatsService.prototype.getRandomData = function () {
        return this.dataSource;
    };
    StatsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], StatsService);
    return StatsService;
    var _a;
}());
exports.StatsService = StatsService;
//# sourceMappingURL=stat.service.js.map
});

;require.register("services/template.service.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var file_uploader_class_1 = require("../lib/ng2-file-upload/components/file-upload/file-uploader.class");
var app_config_1 = require("../app.config");
var _ = require("lodash");
var TemplateService = (function () {
    function TemplateService(http) {
        this.http = http;
        this.serverUrl = app_config_1.config.serverUrl + '/template';
    }
    TemplateService.prototype.hasPreview = function (id, status) {
        var url = this.serverUrl + '/hasPreview';
        var params = new http_1.URLSearchParams();
        params.set("id", id.toString());
        params.set("status", status);
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.findFile = function (id, status, fileName) {
        var url = this.serverUrl + '/findFile';
        var params = new http_1.URLSearchParams();
        params.set("id", id.toString());
        params.set("status", status);
        params.set("fileName", fileName);
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.findFiles = function (id, status) {
        var url = this.serverUrl + '/findFiles';
        var params = new http_1.URLSearchParams();
        params.set("id", id.toString());
        params.set("status", status);
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.clearFiles = function (id) {
        var url = this.serverUrl + '/clearFiles';
        var params = new http_1.URLSearchParams();
        params.set("_id", id.toString());
        return this.http
            .delete(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.count = function (queryParams) {
        var url = this.serverUrl + '/count';
        var params = new http_1.URLSearchParams();
        _.forEach(queryParams, function (value, key) {
            params.set(key, JSON.stringify(value));
        });
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.find = function (queryParams) {
        var url = this.serverUrl + '/find';
        var params = new http_1.URLSearchParams();
        _.forEach(queryParams, function (value, key) {
            params.set(key, JSON.stringify(value));
        });
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.findOne = function (queryParams) {
        var url = this.serverUrl + '/findOne';
        var params = new http_1.URLSearchParams();
        _.forEach(queryParams, function (value, key) {
            params.set(key, JSON.stringify(value));
        });
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.create = function (template) {
        return this.http
            .post(this.serverUrl, template)
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.update = function (template) {
        return this.http
            .put(this.serverUrl, template)
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.remove = function (id) {
        var params = new http_1.URLSearchParams();
        params.set("_id", id.toString());
        return this.http
            .delete(this.serverUrl, { search: params })
            .map(function (response) { return response.json(); });
    };
    TemplateService.prototype.getUploader = function () {
        return new file_uploader_class_1.FileUploader({
            url: this.serverUrl + '/upload',
            filters: [
                {
                    name: '.DS_Store',
                    fn: function (file) {
                        var filename = file.name.toLowerCase();
                        return filename.indexOf('.ds_store') < 0;
                    }
                }
            ]
        });
    };
    TemplateService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], TemplateService);
    return TemplateService;
    var _a;
}());
exports.TemplateService = TemplateService;
//# sourceMappingURL=template.service.js.map
});

;require.register("services/user.service.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var app_config_1 = require("../app.config");
var _ = require("lodash");
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.serverUrl = app_config_1.config.serverUrl + '/user';
    }
    UserService.prototype.count = function (queryParams) {
        var url = this.serverUrl + '/count';
        var params = new http_1.URLSearchParams();
        _.forEach(queryParams, function (value, key) {
            params.set(key, JSON.stringify(value));
        });
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.find = function (queryParams) {
        var url = this.serverUrl + '/find';
        var params = new http_1.URLSearchParams();
        _.forEach(queryParams, function (value, key) {
            params.set(key, JSON.stringify(value));
        });
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.findOne = function (queryParams) {
        var url = this.serverUrl + '/findOne';
        var params = new http_1.URLSearchParams();
        _.forEach(queryParams, function (value, key) {
            params.set(key, JSON.stringify(value));
        });
        return this.http
            .get(url, { search: params })
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.create = function (user) {
        return this.http
            .post(this.serverUrl, user)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.update = function (user) {
        return this.http
            .put(this.serverUrl, user)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.remove = function (ids) {
        var params = new http_1.URLSearchParams();
        params.set("ids", ids.toString());
        return this.http
            .delete(this.serverUrl, { search: params })
            .map(function (response) { return response.json(); });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], UserService);
    return UserService;
    var _a;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map
});

;require.register("shared/pager.component.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var PagerComponent = (function () {
    function PagerComponent(element, renderer) {
        this.size = 0;
        this.change = new core_1.EventEmitter();
    }
    Object.defineProperty(PagerComponent.prototype, "count", {
        get: function () {
            return this._count;
        },
        set: function (val) {
            this._count = val;
            this.pages = this.calcPages();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerComponent.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (val) {
            this._page = val;
            this.pages = this.calcPages();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PagerComponent.prototype, "totalPages", {
        get: function () {
            var count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
            return Math.max(count || 0, 1);
        },
        enumerable: true,
        configurable: true
    });
    PagerComponent.prototype.canPrevious = function () {
        return this.page > 1;
    };
    PagerComponent.prototype.canNext = function () {
        return this.page < this.totalPages;
    };
    PagerComponent.prototype.prevPage = function () {
        if (this.page > 1) {
            this.selectPage(--this.page);
        }
    };
    PagerComponent.prototype.nextPage = function () {
        this.selectPage(++this.page);
    };
    PagerComponent.prototype.selectPage = function (page) {
        if (page > 0 && page <= this.totalPages) {
            this.page = page;
            this.change.emit({
                page: page
            });
        }
    };
    PagerComponent.prototype.calcPages = function (page) {
        var pages = [];
        var startPage = 1;
        var endPage = this.totalPages;
        var maxSize = 5;
        var isMaxSized = maxSize < this.totalPages;
        page = page || this.page;
        if (isMaxSized) {
            startPage = ((Math.ceil(page / maxSize) - 1) * maxSize) + 1;
            endPage = Math.min(startPage + maxSize - 1, this.totalPages);
        }
        for (var num = startPage; num <= endPage; num++) {
            pages.push({
                number: num,
                text: num
            });
        }
        return pages;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PagerComponent.prototype, "size", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PagerComponent.prototype, "pagerLeftArrowIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PagerComponent.prototype, "pagerRightArrowIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PagerComponent.prototype, "pagerPreviousIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PagerComponent.prototype, "pagerNextIcon", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], PagerComponent.prototype, "change", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], PagerComponent.prototype, "count", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], PagerComponent.prototype, "page", null);
    PagerComponent = __decorate([
        core_1.Component({
            selector: 'pager',
            template: "\n    <ul class=\"pager\">\n      <li [class.disabled]=\"!canPrevious()\">\n        <a\n          href=\"javascript:void(0)\"\n          (click)=\"selectPage(1)\">\n          <i class=\"{{pagerPreviousIcon}}\"></i>\n        </a>\n      </li>\n      <li [class.disabled]=\"!canPrevious()\">\n        <a\n          href=\"javascript:void(0)\"\n          (click)=\"prevPage()\">\n          <i class=\"{{pagerLeftArrowIcon}}\"></i>\n        </a>\n      </li>\n      <li\n        *ngFor=\"let pg of pages\"\n        [class.active]=\"pg.number === page\">\n        <a\n          href=\"javascript:void(0)\"\n          (click)=\"selectPage(pg.number)\">\n          {{pg.text}}\n        </a>\n      </li>\n      <li [class.disabled]=\"!canNext()\">\n        <a\n          href=\"javascript:void(0)\"\n          (click)=\"nextPage()\">\n          <i class=\"{{pagerRightArrowIcon}}\"></i>\n        </a>\n      </li>\n      <li [class.disabled]=\"!canNext()\">\n        <a\n          href=\"javascript:void(0)\"\n          (click)=\"selectPage(totalPages)\">\n          <i class=\"{{pagerNextIcon}}\"></i>\n        </a>\n      </li>\n    </ul>\n  ",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _c) || Object])
    ], PagerComponent);
    return PagerComponent;
    var _a, _b, _c;
}());
exports.PagerComponent = PagerComponent;
//# sourceMappingURL=pager.component.js.map
});

;require.register("shared/validators/availability.validator.ts", function(exports, require, module) {
"use strict";
var EMAIL_REGEXP = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
function EmailAvailabilityValidator(authService, originalValue) {
    return function (control) {
        return new Promise(function (resolve) {
            if (originalValue === control.value) {
                resolve(null);
            }
            if (!EMAIL_REGEXP.test(control.value)) {
                resolve(null);
            }
            authService.checkEmail(control.value)
                .then(function (data) {
                if (data.isAvailable) {
                    resolve(null);
                }
                else {
                    resolve({ 'emailTaken': true });
                }
            })
                .catch(function () {
                resolve({ 'emailTaken': true });
            });
        });
    };
}
exports.EmailAvailabilityValidator = EmailAvailabilityValidator;
//# sourceMappingURL=availability.validator.js.map
});

;require.register("shared/validators/email-format.validator.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var EmailValidator = (function () {
    function EmailValidator() {
    }
    EmailValidator.prototype.validate = function (c) {
        return EmailValidator.isValidFormat(c);
    };
    EmailValidator.isValidFormat = function (c) {
        return EMAIL_REGEXP.test(c.value) ? null : {
            invalidEmail: true
        };
    };
    EmailValidator = __decorate([
        core_1.Directive({
            selector: '[invalidEmail][formControlName],[invalidEmail][ngModel],[invalidEmail][formControl]',
            providers: [
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return EmailValidator; }), multi: true }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], EmailValidator);
    return EmailValidator;
}());
exports.EmailValidator = EmailValidator;
//# sourceMappingURL=email-format.validator.js.map
});

;require.register("shared/validators/equal.validator.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var EqualValidator = (function () {
    function EqualValidator(validateEqual) {
        this.validateEqual = validateEqual;
    }
    EqualValidator.prototype.validate = function (c) {
        var v = c.value;
        var e = c.root.get(this.validateEqual).value;
        if (e && v !== e.value)
            return {
                validateEqual: false
            };
        return null;
    };
    EqualValidator.isPasswordMatch = function (ref) {
        return function (c) {
            var hostValue = c.value;
            var refControl = c.root.get(ref);
            if (refControl && hostValue !== refControl.value)
                return {
                    validateEqual: false
                };
            return null;
        };
    };
    EqualValidator.notify = function (ref) {
        return function (c) {
            var refControl = c.root.get(ref);
            if (refControl) {
                refControl.updateValueAndValidity();
            }
            return null;
        };
    };
    EqualValidator = __decorate([
        core_1.Directive({
            selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
            providers: [
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return EqualValidator; }), multi: true }
            ]
        }),
        __param(0, core_1.Attribute('validateEqual')), 
        __metadata('design:paramtypes', [String])
    ], EqualValidator);
    return EqualValidator;
}());
exports.EqualValidator = EqualValidator;
//# sourceMappingURL=equal.validator.js.map
});

;require.register("shared/validators/password-format.validator.ts", function(exports, require, module) {
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var PSD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{9,}$/;
var PSDValidator = (function () {
    function PSDValidator() {
    }
    PSDValidator.prototype.validate = function (c) {
        return PSDValidator.isValidFormat(c);
    };
    PSDValidator.isValidFormat = function (c) {
        return PSD_REGEXP.test(c.value) ? null : {
            invalidPassword: true
        };
    };
    PSDValidator = __decorate([
        core_1.Directive({
            selector: '[invalidPassword][formControlName],[invalidPassword][ngModel],[invalidPassword][formControl]',
            providers: [
                { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return PSDValidator; }), multi: true }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], PSDValidator);
    return PSDValidator;
}());
exports.PSDValidator = PSDValidator;
//# sourceMappingURL=password-format.validator.js.map
});

;require.register("vendor.ts", function(exports, require, module) {
"use strict";
require('es6-shim');
require('es6-promise');
require('zone.js/dist/zone');
require('reflect-metadata');
require('@angular/compiler');
require('@angular/platform-browser');
var core_1 = require('@angular/core');
require('rxjs');
require('lodash');
var production = 'production';
if (production === 'development') {
    core_1.enableProdMode();
}
//# sourceMappingURL=vendor.js.map
});

;require.register("components/app/app.component.html", function(exports, require, module) {
module.exports = "<span defaultOverlayTarget></span>\n\n<div id=\"app\">\n  <div class=\"app-header\">\n    <div class=\"header-panel\">\n      <div class=\"header-logo\">\n        <img\n          routerLink=\"/platform\"\n          src=\"img/ic_logo_header.png\"/>\n      </div>\n      <div class=\"header-menu\">\n        <div class=\"header-menu-items\">\n          <div class=\"header-menu-item\"\n               routerLink=\"/features\"\n               [ngClass]=\"{active: isActiveUrl('features')}\">\n            기능\n          </div>\n          <div class=\"header-menu-item\"\n               routerLink=\"/templates\"\n               [ngClass]=\"{active: isActiveUrl('templates')}\">\n            템플릿\n          </div>\n          <div class=\"header-menu-item\"\n               routerLink=\"/pricing\"\n               [ngClass]=\"{active: isActiveUrl('pricing')}\">\n            가격\n          </div>\n          <div class=\"header-menu-item\"\n               routerLink=\"/support\"\n               [ngClass]=\"{active: isActiveUrl('support')}\">\n            고객지원\n          </div>\n          <div class=\"header-menu-item start-menu\"\n               routerLink=\"/start\"\n               [ngClass]=\"{active: isActiveUrl('start')}\">\n            <img\n              routerLink=\"/start\"\n              src=\"img/ic_symbol.png\"/>\n            시작하기\n          </div>\n        </div>\n        <div class=\"header-account-items\">\n          <div class=\"header-account-item\">로그인</div>\n          <div class=\"header-account-item register\">회원가입</div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"app-content\">\n    <router-outlet></router-outlet>\n  </div>\n  <div class=\"app-footer\">\n    <div class=\"footer-panel\">\n      <div class=\"footer-sitemap\">\n        <div class=\"sitemap-label\">Site Map</div>\n        <div class=\"sitemap-menu-row\">\n          <div class=\"sitemap-menu-item\">소개</div>\n          <div class=\"sitemap-menu-item\">요금제</div>\n        </div>\n        <div class=\"sitemap-menu-row\">\n          <div class=\"sitemap-menu-item\">기능</div>\n          <div class=\"sitemap-menu-item\">자주묻는질문</div>\n        </div>\n        <div class=\"sitemap-menu-row\">\n          <div class=\"sitemap-menu-item\">가격</div>\n          <div class=\"sitemap-menu-item\">문의하기</div>\n        </div>\n        <div class=\"sitemap-menu-row\">\n          <div class=\"sitemap-menu-item\">고객지원</div>\n          <div class=\"sitemap-menu-item\">이용약관</div>\n        </div>\n        <div class=\"sitemap-menu-row\">\n          <div class=\"sitemap-menu-item\">시작하기</div>\n          <div class=\"sitemap-menu-item\">개인정보 취급방침</div>\n        </div>\n      </div>\n      <div class=\"footer-company\">\n        <div class=\"company-name\">\n          <img src=\"img/ic_logo_footer.png\"/>\n        </div>\n        <div class=\"company-description\">(주)어플리캣 사업자등록번호 | 258-81-00137 대표자 | 홍승표</div>\n        <div class=\"company-description\">소프트웨어개발및판매 어플리캐이션서비스</div>\n        <div class=\"company-description\">주소 | 강남구 선릉로90길 36, 미소빌딩 8층 이메일 | info@calendarServer.com</div>\n        <div class=\"company-description\">고객센터 | 02-558-8867 (운영시간 09:30~18:30)</div>\n        <div class=\"company-sns\">\n          <div>FOLLOW US</div>\n          <img src=\"img/ic_sns_fb.png\"/>\n          <img src=\"img/ic_sns_insta.png\"/>\n          <img src=\"img/ic_sns_LinkedIn.png\"/>\n        </div>\n\n      </div>\n    </div>\n  </div>\n</div>"
});

;require.register("components/features/features.component.html", function(exports, require, module) {
module.exports = "<div class=\"panel-content\">\n  <md-card>\n    <md-card-title>기능</md-card-title>\n    <md-card-content>\n    기능\n    </md-card-content>\n  </md-card>\n\n</div>"
});

;require.register("components/login/login.component.html", function(exports, require, module) {
module.exports = "<div class=\"panel-content\">\n  <md-card>\n    <md-card-title>Login</md-card-title>\n    <md-card-content>\n      <form class=\"form-modal\"\n            [formGroup]=\"loginForm\"\n            novalidate\n            (ngSubmit)=\"login()\">\n        <div class=\"form-field\">\n          <md-input #email\n                    type=\"email\"\n                    placeholder=\"이메일\"\n                    formControlName=\"email\">\n          </md-input>\n        </div>\n        <div class=\"form-field\">\n          <md-input #password\n                    type=\"password\"\n                    placeholder=\"비밀번호\"\n                    formControlName=\"password\">\n          </md-input>\n        </div>\n        <div class=\"form-button\">\n          <button type=\"button\"\n                  md-raised-button\n                  color=\"primary\"\n                  (click)=\"login()\">\n            <!--[disabled]=\"!loginForm.valid\"-->\n            로그인\n          </button>\n        </div>\n      </form>\n      <br>\n\n      <div class=\"form-button\">\n        <button type=\"button\"\n                md-raised-button\n                color=\"primary\"\n                (click)=\"facebookLogin()\">\n          <!--[disabled]=\"!loginForm.valid\"-->\n          Facebook 로그인\n        </button>\n      </div>\n      <br>\n      <div class=\"form-button\">\n        <button type=\"button\"\n                md-raised-button\n                color=\"primary\"\n                (click)=\"googleLogin()\">\n          <!--[disabled]=\"!loginForm.valid\"-->\n          Google 로그인\n        </button>\n      </div>\n      <br>\n      <label>result: </label>\n      <div>{{result | json}}</div>\n\n    </md-card-content>\n  </md-card>\n\n</div>"
});

;require.register("components/material-example/material-example.component.html", function(exports, require, module) {
module.exports = "<div class=\"title\">\n  button\n</div>\n<br>\n<button md-button>FLAT</button>\n<button md-raised-button>RAISED</button>\n<button md-icon-button>\n  <md-icon class=\"md-24\">favorite</md-icon>\n</button>\n<button md-fab>\n  <md-icon class=\"md-24\">add</md-icon>\n</button>\n<button md-mini-fab>\n  <md-icon class=\"md-24\">add</md-icon>\n</button>\n<br><br>\n<button md-raised-button color=\"primary\">PRIMARY</button>\n<button md-raised-button color=\"accent\">ACCENT</button>\n<button md-raised-button color=\"warn\">WARN</button>\n<br><br>\n<button md-button disabled>OFF</button>\n<button md-raised-button [disabled]=\"isDisabled\">OFF</button>\n<button md-mini-fab [disabled]=\"isDisabled\">\n  <md-icon>check</md-icon>\n</button>\n<div class=\"title\">\n  cards\n</div>\n<div class=\"container\">\n  <md-card>\n    Basic card.\n  </md-card>\n  <br>\n  <md-card>\n    <md-card-subtitle>Subtitle first</md-card-subtitle>\n    <md-card-title>Card with title</md-card-title>\n    <md-card-content>\n      <p>This is supporting text.</p>\n      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do\n        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>\n    </md-card-content>\n    <md-card-actions>\n      <button md-button>LIKE</button>\n      <button md-button>SHARE</button>\n    </md-card-actions>\n  </md-card>\n  <br>\n  <md-card>\n    <md-card-header>\n      <img md-card-avatar src=\"http://www.freeiconspng.com/uploads/profile-icon-9.png\">\n      <md-card-title>Header title</md-card-title>\n      <md-card-subtitle>Header subtitle</md-card-subtitle>\n    </md-card-header>\n    <img md-card-image src=\"http://cfile9.uf.tistory.com/image/165AB9364D8CA0D326DC3F\">\n    <md-card-content>\n      <p>Here is some more content</p>\n    </md-card-content>\n  </md-card>\n  <br>\n  <md-card>\n    <md-card-title-group>\n      <img md-card-sm-image src=\"http://www.freeiconspng.com/uploads/profile-icon-9.png\">\n      <md-card-title>Card with title</md-card-title>\n      <md-card-subtitle>Subtitle</md-card-subtitle>\n    </md-card-title-group>\n  </md-card>\n</div>\n<div class=\"title\">\n  checkbox\n</div>\n<div class=\"container\">\n  <ul>\n    <li *ngFor=\"let todo of todos\">\n      <md-checkbox [checked]=\"todo.completed\"\n                   (change)=\"todo.completed = $event.checked\">\n        {{todo.name}}\n      </md-checkbox>\n    </li>\n  </ul>\n  <br>\n  <form (submit)=\"saveUser()\">\n    <!-- Form fields... -->\n    <div>\n      <md-checkbox [(ngModel)]=\"user.agreesToTOS\" name=\"agree\">\n        I have read and agree to the terms of service.\n      </md-checkbox>\n    </div>\n    <button type=\"submit\" [disabled]=\"!user.agreesToTOS\">Sign Up</button>\n  </form>\n  <br>\n  <md-checkbox [checked]=\"false\"\n               [indeterminate]=\"isIndeterminate\"\n               (change)=\"isIndeterminate = false\">\n    Click the Button Below to Make Me Indeterminate.\n  </md-checkbox>\n  <button type=\"button\" (click)=\"isIndeterminate = true\">\n    Make Indeterminate\n  </button>\n  <br>\n  <md-checkbox [checked]=\"true\" align=\"end\">\n    I come after my label.\n  </md-checkbox>\n</div>\n<div class=\"title\">\n  radio\n</div>\n<div class=\"container\">\n  <md-radio-group>\n    <md-radio-button value=\"1\">1</md-radio-button>\n    <md-radio-button value=\"2\">2</md-radio-button>\n  </md-radio-group>\n  <br>\n  <md-radio-group [(ngModel)]=\"groupValue\">\n    <md-radio-button *ngFor=\"let d of data\" [value]=\"d.value\">\n      {{d.label}}\n    </md-radio-button>\n  </md-radio-group>\n  <div>\n    groupValue = {{groupValue}}\n  </div>\n</div>\n<div class=\"title\">\n  input\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    Prefix + Suffix\n  </div>\n  <md-input placeholder=\"amount\" align=\"end\">\n    <span md-prefix>$&nbsp;</span>\n    <span md-suffix>.00</span>\n  </md-input>\n  <div class=\"subtitle\">\n    Hints\n  </div>\n  <md-input placeholder=\"Character count (100 max)\" maxlength=\"100\" class=\"demo-full-width\"\n            value=\"Hello world. How are you?\"\n            #characterCountHintExample>\n    <md-hint align=\"end\">{{characterCountHintExample.characterCount}} / 100</md-hint>\n  </md-input>\n  <div class=\"subtitle\">\n    Full Forms\n  </div>\n  <md-card class=\"demo-card demo-basic\">\n    <md-toolbar color=\"primary\">Basic</md-toolbar>\n    <md-card-content>\n      <form>\n        <md-input class=\"demo-full-width\" placeholder=\"Company (disabled)\" disabled value=\"Google\">\n          <md-hint align=\"end\" class=\"\">end</md-hint>\n          <md-hint class=\"alert-danger float-left\">\n            start\n          </md-hint>\n        </md-input>\n\n        <table style=\"width: 100%\" cellspacing=\"0\">\n          <tr>\n            <td>\n              <md-input placeholder=\"First name\" style=\"width: 100%\"></md-input>\n            </td>\n            <td>\n              <md-input placeholder=\"Long Last Name That Will Be Truncated\" style=\"width: 100%\"></md-input>\n            </td>\n          </tr>\n        </table>\n        <p>\n          <md-input class=\"demo-full-width\" placeholder=\"Address\" value=\"1600 Amphitheatre Pkway\"></md-input>\n          <md-input class=\"demo-full-width\" placeholder=\"Address 2\"></md-input>\n        </p>\n        <table style=\"width: 100%\" cellspacing=\"0\">\n          <tr>\n            <td>\n              <md-input class=\"demo-full-width\" placeholder=\"City\"></md-input>\n            </td>\n            <td>\n              <md-input class=\"demo-full-width\" placeholder=\"State\"></md-input>\n            </td>\n            <td>\n              <md-input #postalCode class=\"demo-full-width\" maxlength=\"5\"\n                        placeholder=\"Postal Code\"\n                        value=\"94043\">\n                <md-hint align=\"end\">{{postalCode.characterCount}} / 5</md-hint>\n              </md-input>\n            </td>\n          </tr>\n        </table>\n      </form>\n    </md-card-content>\n  </md-card>\n</div>\n<div class=\"title\">\n  toolbar\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    기본\n  </div>\n  <md-toolbar [color]=\"'accent'\">\n    <span>color변수는 \"primary\",\"accent\",\"warn\"</span>\n  </md-toolbar>\n  <div class=\"subtitle\">\n    툴바는 여러줄로 만들어질 수 있다. md-toolbar안에 'md-toolbar-row'태그를 넣어서 만들 수 있다.\n  </div>\n  <md-toolbar [color]=\"myColor\">\n    <span>First Row</span>\n\n    <md-toolbar-row>\n      <span>Second Row</span>\n    </md-toolbar-row>\n\n    <md-toolbar-row>\n      <span>Third Row</span>\n    </md-toolbar-row>\n  </md-toolbar>\n  <div class=\"subtitle\">\n    툴바안에 정렬은 flexbox css속성으로 설정할 수 있다.\n  </div>\n  <md-toolbar color=\"primary\">\n    <span>Application Title</span>\n\n    <!-- This fills the remaining space of the current row -->\n    <span class=\"example-fill-remaining-space\"></span>\n\n    <span>Right Aligned Text</span>\n  </md-toolbar>\n</div>\n<div class=\"title\">\n  list\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    기본\n  </div>\n  <md-list>\n    <md-list-item> Pepper</md-list-item>\n    <md-list-item> Salt</md-list-item>\n    <md-list-item> Paprika</md-list-item>\n  </md-list>\n  <div class=\"subtitle\">\n    여러줄 리스트. 리스트아이템들이 여러줄을 가지고 있어야 한다면 태그에 md-line attribute를 넣어야 합니다.<br>\n    모든 태그 다 가능하지만 h3는 안됩니다\n  </div>\n  <md-list>\n    <md-list-item *ngFor=\"let message of messages\">\n      <h3 md-line> {{message.from}} </h3>\n      <p md-line>\n        <span> {{message.subject}} </span>\n        <span class=\"demo-2\"> -- {{message.message}} </span>\n      </p>\n    </md-list-item>\n  </md-list>\n  <md-list>\n    <md-list-item *ngFor=\"let message of messages\">\n      <h3 md-line> {{message.from}} </h3>\n      <p md-line> {{message.subject}} </p>\n      <p md-line class=\"demo-2\"> {{message.message}} </p>\n    </md-list-item>\n  </md-list>\n  <div class=\"subtitle\">\n    왼쪽에 사진이 있는 목록들\n  </div>\n  <md-list>\n    <md-list-item *ngFor=\"let message of messages\">\n      <img md-list-avatar src=\"http://www.freeiconspng.com/uploads/profile-icon-9.png\" alt=\"...\">\n      <h3 md-line> {{message.from}} </h3>\n      <p md-line>\n        <span> {{message.subject}} </span>\n        <span class=\"demo-2\"> -- {{message.message}} </span>\n      </p>\n    </md-list-item>\n  </md-list>\n  <div class=\"subtitle\">\n    Dense lists\n  </div>\n  <md-list dense>\n    <md-list-item> Pepper</md-list-item>\n    <md-list-item> Salt</md-list-item>\n    <md-list-item> Paprika</md-list-item>\n  </md-list>\n  <div class=\"subtitle\">\n    리스트에 서브헤더를 넣을 수 있습니다 태그에 md-subheader attribute만 넣으면 됩니다.\n  </div>\n  <md-list>\n    <h3 md-subheader>Folders</h3>\n    <md-list-item *ngFor=\"let message of messages\">\n      <md-icon md-list-avatar>folder</md-icon>\n      <h4 md-line>{{message.from}}</h4>\n      <p md-line class=\"demo-2\"> {{message.subject}} </p>\n    </md-list-item>\n    <md-divider></md-divider>\n    <h3 md-subheader>Notes</h3>\n    <md-list-item *ngFor=\"let message of messages\">\n      <md-icon md-list-avatar>note</md-icon>\n      <h4 md-line>{{message.from}}</h4>\n      <p md-line class=\"demo-2\"> {{message.subject}} </p>\n    </md-list-item>\n  </md-list>\n</div>\n<div class=\"title\">\n  grid\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    기본\n  </div>\n  <md-grid-list cols=\"4\" [style.background]=\"'lightblue'\">\n    <md-grid-tile>One</md-grid-tile>\n    <md-grid-tile>Two</md-grid-tile>\n    <md-grid-tile>Three</md-grid-tile>\n    <md-grid-tile>Four</md-grid-tile>\n  </md-grid-list>\n  <div class=\"subtitle\">\n    옵션을 설정한 Grid\n  </div>\n  <md-grid-list cols=\"4\" rowHeight=\"100px\">\n    <md-grid-tile *ngFor=\"let tile of tiles\" [colspan]=\"tile.cols\" [rowspan]=\"tile.rows\"\n                  [style.background]=\"tile.color\">\n      {{tile.text}}\n    </md-grid-tile>\n  </md-grid-list>\n</div>\n<div class=\"title\">\n  icon\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    Ligatures\n  </div>\n  <md-icon>home</md-icon>\n</div>\n<div class=\"title\">\n  progress-circle\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    Progress Modes\n  </div>\n  <md-progress-circle mode=\"determinate\"\n                      aria-valuemin=\"0\"\n                      aria-valuemax=\"100\"\n                      [value]=\"i\"></md-progress-circle>\n  <md-progress-circle mode=\"indeterminate\"></md-progress-circle>\n  <md-spinner></md-spinner>\n</div>\n<div class=\"title\">\n  progress-bar\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    Progress Modes - Determinate\n  </div>\n  <md-progress-bar mode=\"determinate\"\n                   aria-valuemin=\"0\"\n                   aria-valuemax=\"100\"\n                   [value]=\"i\"></md-progress-bar>\n  <div class=\"subtitle\">\n    Progress Modes - Indeterminate\n  </div>\n  <md-progress-bar mode=\"indeterminate\"></md-progress-bar>\n  <div class=\"subtitle\">\n    Progress Modes - Buffer\n  </div>\n  <md-progress-bar mode=\"buffer\" [value]=\"i\" [bufferValue]=\"100\"></md-progress-bar>\n  <div class=\"subtitle\">\n    Progress Modes - Query\n  </div>\n  <md-progress-bar mode=\"query\"></md-progress-bar>\n</div>\n<div class=\"title\">\n  tabs\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    기본 selectedIndex로 active 탭을 설정할 수 있습니다. index는 0, 1, 2..순으로\n  </div>\n  <md-tab-group [selectedIndex]=\"1\">\n    <md-tab>\n      <template md-tab-label>One</template>\n      <template md-tab-content>\n        <h1>Some tab content</h1>\n        <p>다른내용들을</p>\n        <p>채워주세요</p>\n      </template>\n    </md-tab>\n    <md-tab>\n      <template md-tab-label>Two</template>\n      <template md-tab-content>\n        <h1>Some more tab content</h1>\n        <p>...</p>\n      </template>\n    </md-tab>\n  </md-tab-group>\n</div>\n<div class=\"title\">\n  slide-toggle\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    기본\n  </div>\n  <md-slide-toggle [(ngModel)]=\"slideToggleModel\">\n    Default Slide Toggle\n  </md-slide-toggle>\n  <div class=\"subtitle\">\n    disabled된 토글\n  </div>\n  <md-slide-toggle disabled>\n    Disabled Slide Toggle\n  </md-slide-toggle>\n</div>\n<div class=\"title\">\n  button-toggle\n</div>\n\n<div class=\"container\">\n  <div class=\"subtitle\">\n    기본\n  </div>\n  <md-button-toggle>Bold</md-button-toggle>\n  <div class=\"subtitle\">\n    토글중에 하나만 선택이 됨 라디오 버튼처럼\n  </div>\n  <md-button-toggle-group name=\"alignment\">\n    <md-button-toggle value=\"left\">\n      <md-icon>format_align_left</md-icon>\n    </md-button-toggle>\n    <md-button-toggle value=\"center\">\n      <md-icon>format_align_center</md-icon>\n    </md-button-toggle>\n    <md-button-toggle value=\"right\">\n      <md-icon>format_align_right</md-icon>\n    </md-button-toggle>\n    <md-button-toggle value=\"justify\">\n      <md-icon>format_align_justify</md-icon>\n    </md-button-toggle>\n  </md-button-toggle-group>\n  <div class=\"subtitle\">\n    토글이 여러개 선택이 됨 체크박스처\n  </div>\n  <md-button-toggle-group multiple>\n    <md-button-toggle>Flour</md-button-toggle>\n    <md-button-toggle>Eggs</md-button-toggle>\n    <md-button-toggle>Sugar</md-button-toggle>\n    <md-button-toggle>Milk</md-button-toggle>\n  </md-button-toggle-group>\n  <div class=\"subtitle\">\n    토글 선택에 따라 값이 변하는 것을 확인할 수 있음\n  </div>\n  <md-button-toggle-group name=\"pies\" [(ngModel)]=\"favoritePie\">\n    <md-button-toggle *ngFor=\"let pie of pieOptions\" [value]=\"pie\">\n      {{pie}}\n    </md-button-toggle>\n  </md-button-toggle-group>\n  <p>Your favorite type of pie is: {{favoritePie}}</p>\n  <div class=\"subtitle\">\n    disabled 토글\n  </div>\n  <md-button-toggle-group disabled>\n    <md-button-toggle value=\"one\">One</md-button-toggle>\n    <md-button-toggle value=\"two\">Two</md-button-toggle>\n    <md-button-toggle value=\"three\">Three</md-button-toggle>\n  </md-button-toggle-group>\n  <br>\n  <md-button-toggle-group>\n    <md-button-toggle value=\"red\" disabled>Red</md-button-toggle>\n    <md-button-toggle value=\"blue\">Blue</md-button-toggle>\n  </md-button-toggle-group>\n</div>\n<div class=\"title\">\n  slider\n</div>\n<div class=\"container\">\n  <div class=\"subtitle\">\n    기본\n  </div>\n  <md-slider></md-slider>\n</div>\n"
});

;require.register("components/platform/platform.component.html", function(exports, require, module) {
module.exports = "<div class=\"panel-content\">\n  <md-card>\n    <md-card-title>플랫폼</md-card-title>\n    <md-card-content>\n      플랫폼\n    </md-card-content>\n  </md-card>\n\n</div>"
});

;require.register("components/previewer/previewer.component.html", function(exports, require, module) {
module.exports = "<div #previewerContainer class=\"previewer-container\">\n\n  <!--[style.width]=\"(previewDevice.styles.width / (previewScale + 0.026) ) + 'px'\"-->\n  <!--[style.height]=\"(previewDevice.styles.height / (previewScale + 0.026)) + 'px'\"-->\n\n  <div class=\"no-preview-message\" *ngIf=\"!hasPreview\">\n    <span>미리보기가 존재 하지 않습니다.</span>\n  </div>\n  <iframe #device\n          [style.transform]=\"'scale(' + previewScale + ')'\"\n          [ngClass]=\"{'no-preview': !hasPreview}\"\n          [style.width]=\"previewDevice.styles.width  + 'px'\"\n          [style.height]=\"previewDevice.styles.height + 'px'\">\n  </iframe>\n</div>\n"
});

;require.register("components/pricing/pricing.component.html", function(exports, require, module) {
module.exports = "<div class=\"panel-content\">\n  <md-card>\n    <md-card-title>가격</md-card-title>\n    <md-card-content>\n      가격\n    </md-card-content>\n  </md-card>\n\n</div>"
});

;require.register("components/start/start.component.html", function(exports, require, module) {
module.exports = "<div class=\"panel-content\">\n  <md-card>\n    <md-card-title>시작하기</md-card-title>\n    <md-card-content>\n      시작하기\n    </md-card-content>\n  </md-card>\n\n</div>"
});

;require.register("components/support/support.component.html", function(exports, require, module) {
module.exports = "<div class=\"panel-content\">\n  <md-card>\n    <md-card-title>고객지원</md-card-title>\n    <md-card-content>\n      고객지원\n    </md-card-content>\n  </md-card>\n\n</div>"
});

;require.register("components/template-detail/template-detail.component.html", function(exports, require, module) {
module.exports = "<div class=\"template-detail-container\">\n  <md-grid-list cols=\"2\" rowHeight=\"820px\" gutterSize=\"0px\">\n    <md-grid-tile class=\"preview-section\" [colspan]=\"1\">\n      <div class=\"preview-label\">\n        미리보기\n      </div>\n      <div class=\"preview-type-switcher\">\n        <md-button-toggle-group\n          [(ngModel)]=\"selectedMode\">\n          <md-button-toggle value=\"preview\">핸드폰 미리보기</md-button-toggle>\n          <md-button-toggle value=\"overview\">스크린 미리보기</md-button-toggle>\n        </md-button-toggle-group>\n      </div>\n\n      <div class=\"template-view-panel\" [ngSwitch]=\"selectedMode\">\n        <div *ngSwitchCase=\"'preview'\">\n          <div class=\"preview-device-switcher\">\n            <div class=\"label-ios\"\n                 [ngClass]=\"{active: !isAndroid}\">iOS\n            </div>\n            <md-slide-toggle [(ngModel)]=\"isAndroid\">\n            </md-slide-toggle>\n            <div class=\"label-android\"\n                 [ngClass]=\"{active: isAndroid}\">Android\n            </div>\n          </div>\n          <div class=\"preview-viewer-container\">\n            <previewer #previewer *ngIf=\"template\"\n                       [previewDevice]=\"previewDevice\"\n                       [previewScale]=\"previewScale\"\n                       [previewApp]=\"template.previewUrl\">\n            </previewer>\n          </div>\n        </div>\n\n        <div class=\"overview-screens\" *ngSwitchCase=\"'overview'\">\n          <md-grid-list cols=\"2\" rowHeight=\"340px\" gutterSize=\"0px\">\n            <template ngFor let-photo [ngForOf]=\"template.photos\" let-i=\"index\">\n              <md-grid-tile class=\"overview-page\" [colspan]=\"1\"\n                            *ngIf=\"isScreenShot(photo.tags)\">\n                <div class=\"screen-shot\">\n                  <img [src]=\"photo.url\"/>\n                  <div class=\"screen-shot-hover\">\n                    <button>크게 보기</button>\n                  </div>\n                </div>\n                <div class=\"screen-name\">\n                  <span>{{photo.note}}</span>\n                </div>\n              </md-grid-tile>\n            </template>\n          </md-grid-list>\n        </div>\n      </div>\n    </md-grid-tile>\n    <md-grid-tile [colspan]=\"1\" class=\"template-detail-info\">\n      <div class=\"shopping-section\">\n        <div class=\"template-name\">{{template.name}}</div>\n        <div class=\"template-price\">{{template.price | number}}원</div>\n        <div class=\"template-sale-price-container\">\n          <span class=\"template-sale-tag\">[{{template.saleTag}}]</span>\n          <span class=\"template-sale-price\">{{template.salePrice | number}}원</span>\n        </div>\n        <div class=\"template-shopping-action\">\n          <div class=\"template-action-like\">\n            <div class=\"template-action-like-icon\">\n              <!--<img src=\"img/ic_heart_default.png\"/>-->\n            </div>\n            <span>찜하기</span>\n          </div>\n          <div class=\"template-action-cart\">\n            <div class=\"template-action-cart-icon\">\n              <!--<img src=\"img/ic_cart_default.png\"/>-->\n            </div>\n            <span>장바구니</span>\n          </div>\n        </div>\n        <div class=\"template-action-release-container\">\n          <button class=\"template-action-release\">출시하기</button>\n        </div>\n      </div>\n      <div class=\"divider\"></div>\n      <div class=\"detail-section\">\n        <div class=\"detail-category\">\n          <div class=\"detail-label\">카테고리</div>\n          <div class=\"detail-value\">\n            <span>{{template.category}}</span>\n            <md-icon>keyboard_arrow_right</md-icon>\n            <span>{{template.subCategory}}</span>\n          </div>\n        </div>\n        <div class=\"detail-keyword\">\n          <div class=\"detail-label\">키워드</div>\n          <div class=\"detail-value-list\">\n            <div class=\"list-item\" *ngFor=\"let tag of template.tags; let i = index\">\n              <span class=\"divider\" *ngIf=\"i != 0\"> / </span>\n              <span>{{tag.name}}</span>\n            </div>\n          </div>\n        </div>\n        <div class=\"detail-feature\">\n          <div class=\"detail-label\">기능</div>\n          <div class=\"detail-value-list\">\n            <div class=\"list-item\" *ngFor=\"let feature of template.features; let i = index\">\n              <span class=\"divider\" *ngIf=\"i != 0\"> / </span>\n              <span>{{feature.name}}</span>\n            </div>\n          </div>\n        </div>\n        <div class=\"detail-description\">\n          <div class=\"detail-label\">설명</div>\n          <div class=\"detail-value\">{{template.description}}</div>\n        </div>\n        <div class=\"detail-recommendation-label\">\n          <div class=\"detail-label\">추천템플릿</div>\n        </div>\n        <div class=\"detail-recommendation-list\">\n          <div class=\"prev-recommendation\">\n            <md-icon>keyboard_arrow_left</md-icon>\n          </div>\n          <div class=\"next-recommendation\">\n            <md-icon>keyboard_arrow_right</md-icon>\n          </div>\n          <md-grid-list cols=\"3\" rowHeight=\"180px\" gutterSize=\"6px\">\n            <md-grid-tile class=\"detail-recommendation-item\"\n                          *ngFor=\"let item of recommendations\">\n              <preload-image [imageSource]=\"template.photos[0].url\" [ratio]=\"1\">\n              </preload-image>\n              <div class=\"description\">\n                <div class=\"name\">\n                  {{item.name}}\n                </div>\n                <span class=\"original-price\">{{item.price | number}}원</span>\n                <div class=\"price-container\">\n                  <span class=\"sale-tag\">[{{item.saleTag}}]</span>\n                  <span class=\"sale-price\">{{item.salePrice | number}}원</span>\n                </div>\n              </div>\n            </md-grid-tile>\n          </md-grid-list>\n        </div>\n      </div>\n    </md-grid-tile>\n  </md-grid-list>\n</div>"
});

;require.register("components/templates/templates.component.html", function(exports, require, module) {
module.exports = "<div class=\"content\" (click)=\"toggleColorSelector($event, false)\">\n  <div class=\"category-selector\">\n    <div class=\"category-panel\">\n      <div class=\"category-item\"\n           *ngFor=\"let category of categories\"\n           [ngClass]=\"{active: isCategorySelected(category.label)}\">\n        <div class=\"category-label\">\n          {{category.label}}\n          <img class=\"category-check\"\n               *ngIf=\"isCategorySelected(category.label)\"\n               src=\"img/ic_checkmark.png\"/>\n        </div>\n        <div class=\"sub-category\">\n          <div class=\"sub-category-item\" *ngFor=\"let subCategory of category.subCategories\"\n               [ngClass]=\"{active: isSubCategorySelected(subCategory)}\"\n               (click)=\"selectSubCategory(category, subCategory)\">\n            {{subCategory}}\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n  <div class=\"category-content\">\n    <div class=\"template-title\">{{selectedSubCategory}} 템플릿 모음</div>\n    <div class=\"template-sub-title\">\n      <div class=\"template-sub-title-label1\">Appzet Keywords</div>\n      <div class=\"template-sub-title-label2\">\n        키워드를 선택해 마음에 드는 템플릿을 찾아보세요!\n      </div>\n    </div>\n    <div class=\"template-keyword-selector\">\n      <div class=\"template-keyword\"\n           *ngFor=\"let tag of mainTags\"\n           [ngClass]=\"{active: isTagSelected(tag.label)}\"\n           (click)=\"selectTag(tag)\">\n        <div class=\"template-keyword-label\">\n          {{tag.label}}\n          <img class=\"template-keyword-new\" *ngIf=\"tag.newItem\" src=\"img/ic_new.png\"/>\n        </div>\n      </div>\n    </div>\n    <div class=\"template-search-result\">\n      <span><strong>14개</strong> 템플릿이 검색되었습니다.</span>\n    </div>\n    <div class=\"template-search-filter\">\n      <div class=\"template-search-sort\">\n        <div class=\"sort-item\"\n             [ngClass]=\"{active: isSortSelected('가격낮은순')}\"\n             (click)=\"selectSort('가격낮은순')\">\n          가격낮은순\n          <img\n            [ngClass]=\"{active: isSortSelected('가격낮은순')}\"\n            src=\"img/ic_checkmark_selectbox.png\"/>\n        </div>\n        <div class=\"vertical-ruler\"></div>\n        <div class=\"sort-item\"\n             [ngClass]=\"{active: isSortSelected('가격높은순')}\"\n             (click)=\"selectSort('가격높은순')\">\n          가격높은순\n          <img src=\"img/ic_checkmark_selectbox.png\"/>\n        </div>\n      </div>\n      <div class=\"template-color\">\n        <label class=\"template-color-label\">색상선택</label>\n        <div class=\"template-color-selector\"\n             (click)=\"toggleColorSelector($event, !isColorOptionOpened)\">\n          <span>{{selectedColor.label}}</span>\n          <img class=\"template-color-selected\"\n               src=\"img/ic_checkmark_selectbox.png\"/>\n          <div class=\"template-color-options\"\n               [ngClass]=\"{active: isColorOptionOpened}\">\n            <div class=\"template-color-item\" *ngFor=\"let color of colorFilters\"\n                 (click)=\"selectColor(color); false\">\n              <div class=\"template-color-panel\">\n                <img [src]=\"color.image\"/><span>{{color.label}}</span>\n              </div>\n              <img class=\"template-color-selected\"\n                   *ngIf=\"isSelectedColor(color.label)\"\n                   src=\"img/ic_checkmark_selectbox.png\"/>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"template-list\">\n      <md-grid-list cols=\"3\" rowHeight=\"10:15\" gutterSize=\"18px\">\n        <md-grid-tile *ngFor=\"let template of templates\">\n          <div class=\"template-list-item\">\n            <div class=\"template-thumbnail-container\">\n              <preload-image [imageSource]=\"template.photos[0].url\" [ratio]=\"1\">\n              </preload-image>\n              <div class=\"template-hover-menu\">\n                <div class=\"template-hover-btn\" (click)=\"openDialog()\">미리보기</div>\n                <div class=\"spacer\"></div>\n                <div class=\"template-hover-btn\">출시하기</div>\n              </div>\n            </div>\n            <div class=\"template-list-item-content\">\n              <div class=\"template-list-item-name\"\n                   (click)=\"openDialog()\">\n                {{template.name}}\n              </div>\n              <div class=\"template-list-item-price-container\">\n                <span class=\"template-list-item-price\">{{template.price | number}}원</span>\n                <span class=\"template-list-item-sale-tag\">[{{template.saleTag}}]</span>\n                <span class=\"template-list-item-sale-price\"><strong>{{template.salePrice | number}}</strong>원</span>\n              </div>\n              <div class=\"template-list-item-action-container\">\n                <div class=\"template-list-item-like\">\n                </div>\n                <div class=\"spacer\"></div>\n                <div class=\"template-list-item-cart\">\n                </div>\n              </div>\n            </div>\n          </div>\n        </md-grid-tile>\n      </md-grid-list>\n    </div>\n    <div class=\"template-list-pager\">\n      <pager\n        [pagerLeftArrowIcon]=\"cssClasses.pagerLeftArrow\"\n        [pagerRightArrowIcon]=\"cssClasses.pagerRightArrow\"\n        [pagerPreviousIcon]=\"cssClasses.pagerPrevious\"\n        [pagerNextIcon]=\"cssClasses.pagerNext\"\n        [page]=\"curPage\"\n        [size]=\"pageSize\"\n        [count]=\"rowCount\"\n        (change)=\"loadPage($event)\">\n      </pager>\n      <div class=\"template-list-top\">\n        <img src=\"img/btn_top.png\" (click)=\"goToHead()\">\n      </div>\n    </div>\n    <div class=\"content-spacer\"></div>\n  </div>\n</div>"
});

;require.register("components/app/app.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/features/features.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/login/login.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/material-example/material-example.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/platform/platform.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/previewer/previewer.component.css", function(exports, require, module) {
module.exports = ":host {\n}\n\n:host /deep/ {\n\n}"
});

;require.register("components/pricing/pricing.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/start/start.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/support/support.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("components/templates/templates.component.css", function(exports, require, module) {
module.exports = ""
});

;require.register("directives/area-chart/area-chart.component.css", function(exports, require, module) {
module.exports = ":host {\n  width: 100%;\n  display:block;\n}\n:host /deep/ .axis path,\n:host /deep/ .axis line {\n  fill: none;\n  stroke: rgba(0, 0, 0, 0.2);\n  color: rgba(0, 0, 0, 0.2);\n  shape-rendering: crispEdges;\n}\n\n:host /deep/ .axis text {\n  font-size: 11px;\n  fill: rgba(0, 0, 0, 0.9);\n}\n\n:host /deep/ .grid .tick {\n  stroke: rgba(0, 0, 0, 0.1);\n  opacity: 0.3;\n}\n\n:host /deep/ .grid path {\n  stroke-width: 0;\n}\n\n:host /deep/ .grid .tick {\n  stroke: rgba(0, 0, 0, 0.1);\n  opacity: 0.3;\n}\n\n:host /deep/ .grid path {\n  stroke-width: 0;\n}\n:host /deep/ .color-label{\n  display: inline;\n}"
});

;require.register("directives/line-graph/line-graph.component.css", function(exports, require, module) {
module.exports = ":host {\n  width: 100%;\n  display: block;\n}\n\n:host /deep/ .axis path,\n:host /deep/ .axis line {\n  fill: none;\n  stroke: rgba(0, 0, 0, 0.2);\n  color: rgba(0, 0, 0, 0.2);\n  shape-rendering: crispEdges;\n}\n\n:host /deep/ .line {\n  fill: none;\n  stroke-width: 2px;\n}\n\n:host /deep/ .axis text {\n  font-size: 11px;\n  fill: rgba(0, 0, 0, 0.9);\n}\n\n:host /deep/ .grid .tick {\n  stroke: rgba(0, 0, 0, 0.1);\n  opacity: 0.3;\n}\n\n:host /deep/ .grid path {\n  stroke-width: 0;\n}\n\n:host /deep/ .grid .tick {\n  stroke: rgba(0, 0, 0, 0.1);\n  opacity: 0.3;\n}\n\n:host /deep/ .grid path {\n  stroke-width: 0;\n}\n\n:host /deep/ .color-label {\n  display: inline;\n}"
});

;require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=main.js.map