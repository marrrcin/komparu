<?php
/**
 * The main API file.
 * Very simple vanilla php for handling restul requests and responses.
 */

// Autoloading, lets leave require in the 90s. ;)
require 'vendor/autoload.php';

// Main code wrapped around anonymous function to keep global scope clear.
call_user_func(function() {
  // Start session.
  session_start();

  // Start buffer output and define response's HTTP headers.
  ob_start(function($data) {
    header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS');
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: ' . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
    header("Content-Type: application/json; charset=UTF-8");
    return $data;
  });

  // Options Action, for handling CORS. Always allow.
  options('*', function(){
    return ok();
  });

  // Get data. This will serve as our database. No point in implementing real
  // database for this task.
  $data = $_SESSION['data'];

  // Generate action, generates fake data in session.
  get('/generate', function(){
    $_SESSION['data'] = generate_fake_data();
    return ok(['count' => count($_SESSION['data'])]);
  });

  // Delete action, deletes all data.
  delete('/', function(){
    $_SESSION['data'] = [];
    return ok(true);
  });

  // Index action.
  get('/', function() use ($data) {
    $page = $_GET['page'] ? (int) $_GET['page'] : 0;
    $size = $_GET['size'] ? (int) $_GET['size'] : 20;
    if (!is_int($page) || !is_int($size)) {
      return bad_request('Page and size GET parameters have to be ints.');
    }
    return ok(pages($data, $page, $size));
  });

  // Default bad request action if nothing elese kicked in.
  call_user_func(bad_request('Missing action name.'));
});

/**
 * Generates fake data.
 *
 * @return array
 */
function generate_fake_data() {
  // I'm too lazy, generate fake data on the fly.
  $faker = Faker\Factory::create();
  $faker->addProvider(new Faker\Provider\Image($faker));
  $count = $faker->numberBetween(50, 500);
  for ($i = 0; $i <= $count; $i++) {
    $data[] = [
      'id' => $i,
      'name' => ucwords($faker->words(3, true)),
      'manufacturer' => $faker->company,
      'price' => $faker->randomFloat(2, 1, 1000),
      'description' => $faker->text(100),
      'picture' => $faker->imageURL(600, 400, 'cats', false) . $faker->numberBetween(1, 10),
    ];
  }
  return $data;
}

/**
 * Generate paged content
 *
 * @param array $data
 * @return array
 */
function pages($data, $page, $size) {
  $dataCount = count($data);
  $size = ($size > 1)
    ? ($size > $dataCount) ? $dataCount : $size
    : 1;
  $total = @ceil($dataCount / $size);
  $page = ($page > 0)
    ? ($page > $total-1) ? $total-1 : $page
    : 0;
  $offset = $page * $size;
  return [
    'total' => $total,
    'page' => $page,
    'items' => array_slice($data, $offset, $size),
    'offset' => $offset,
    'size' => $size,
    'count' => $dataCount,
  ];
}

/**
 * Makes a http response.
 *
 * Sets http response code and returns json encoded response. We will use this
 * function form some simple function currying below for utilit functions such
 * as {@see ok()}, {@see error()}.
 *
 * @param mixed|null $data
 * @return string|void
 */
function response($code, $data=null) {
  return function() use ($code, $data) {
    // Set HTTP response code.
    http_response_code($code);
    // For error responses have unified structure.
    if ($code >= 300) {
      $data = [
        'error' => true,
        'message' => $data,
      ];
    }
    // Echo response body. Headers are aready set, rest will be taken care of 
    // by output buffering.
    echo json_encode($data);
    // Die afterwareds, only one response per request...
    die();
  };
}

/**
 * Generates 200 ok response.
 * @param mixed|null $data
 * @return string|void
 */
function ok($data=null) {
  return response(200, $data);
}

/**
 * Generates 400 bad request response.
 * @param mixed|null $data
 * @return string|void
 */
function bad_request($data=null) {
  return response(400, $data);
}

/**
 * Generates 404 not found response.
 * @param mixed|null $data
 * @return string|void
 */
function not_found($data=null) {
  return response(400, $data);
}

/**
 * Generates 500 internal error response.
 * @param mixed|null $data
 * @return string|void
 */
function error($data=null) {
  return response(500, $data);
}

/**
 * Generates 303 see_other response.
 * @param string $url Url to redirect to.
 * @return string|void
 */
function see_other($url) {
  header('Location: ' . $url);
  return response(303);
}

/**
 * Parses the http request
 *
 * Mathes current HTTP request agains given method and uri. If it's a match it
 * executes callback giving with arguments. Each argument is one * from url. We
 * will use this function form some simple function currying. below for utilit 
 * functions such as {@see ok()}, {@see error()}.
 *
 * @param string $method Http method name.
 * @param string $uri Uri template. Use '*' for variable elements.
 * @param callable Callback function.
 * @return string|void
 */
function request($method, $uri, $callback) {
  // Prepare server path
  $path = $_SERVER['REQUEST_URI'];
  $path = parse_url($path, PHP_URL_PATH);
  $path = trim($path, '/');
  // Prepare regex
  $regex = $uri;
  $regex = trim($regex, '/');
  $regex =  $regex = str_replace('*', '(.*)', $regex);
  $regex = '/^' . str_replace('/', '\/', $regex) . '$/';
  // Make sure our method and path matches.
  if (
    !preg_match($regex, $path, $uri_matches)
    || $_SERVER['REQUEST_METHOD'] !== $method
  ) {
    return;
  }
  // Prepare callback argumnets, each * becomes an argument.
  array_shift($uri_matches);
  $callback_args = $uri_matches;
  // Call our callback, pass uri matches as args.
  $response_func = call_user_func_array($callback, $callback_args);
  // Execute response function.
  return call_user_func($response_func);
}

/**
 * Handle GET request.
 * @param string $uri Uri template.
 * @param callable Callback function.
 * @return string|void
 */
function get($uri, $callback) {
  request('GET', $uri, $callback);
}

/**
 * Handle POST request.
 * @param string $uri Uri template.
 * @param callable Callback function.
 * @return string|void
 */
function post($uri, $callback) {
  request('POST', $uri, $callback);
}

/**
 * Handle DELETE request.
 * @param string $uri Uri template.
 * @param callable Callback function.
 * @return string|void
 */
function delete($uri, $callback) {
  request('DELETE', $uri, $callback);
}

/**
 * Handle OPTIONS request.
 * @param string $uri Uri template.
 * @param callable Callback function.
 * @return string|void
 */
function options($uri, $callback) {
  request('OPTIONS', $uri, $callback);
}
